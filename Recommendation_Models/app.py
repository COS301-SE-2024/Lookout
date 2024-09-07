from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences

app = Flask(__name__)

# Load saved models
post_model = tf.keras.models.load_model('Post_Model/post_recommendation_model.keras')
group_model = tf.keras.models.load_model('Groups_Model/group_recommendation_model.keras')

# Load encoders and data (for both groups and posts)
users_df = pd.read_csv('Post_Model/data/users.csv')
groups_df = pd.read_csv('Groups_Model/data/groups.csv')
joined_groups_df = pd.read_csv('Groups_Model/data/joined_groups.csv')
posts_df = pd.read_csv('Post_Model/data/posts.csv')
saved_posts_df = pd.read_csv('Post_Model/data/saved_posts.csv')

# Load LabelEncoders
group_encoder = LabelEncoder()
group_encoder.fit(groups_df['id'])

post_encoder = LabelEncoder()
post_encoder.fit(posts_df['id'])

user_encoder = LabelEncoder()
user_encoder.fit(users_df['id'])

# Tokenizers and padding for text data (groups and posts)
group_tokenizer = tf.keras.preprocessing.text.Tokenizer()
group_tokenizer.fit_on_texts(groups_df['name'].fillna('') + " " + groups_df['description'].fillna(''))
group_max_len = max(groups_df['name'].apply(len).max(), groups_df['description'].apply(len).max())  # Adjust max length as needed

post_tokenizer = tf.keras.preprocessing.text.Tokenizer()
post_tokenizer.fit_on_texts(posts_df['title'].fillna('') + " " + posts_df['caption'].fillna(''))
post_max_len = max(posts_df['title'].apply(len).max(), posts_df['caption'].apply(len).max())  # Adjust max length as needed

# Utility function for padding sequences
def pad_group_text(texts, max_len):
    sequences = group_tokenizer.texts_to_sequences(texts)
    return pad_sequences(sequences, maxlen=max_len)

def pad_post_text(texts, max_len):
    sequences = post_tokenizer.texts_to_sequences(texts)
    return pad_sequences(sequences, maxlen=max_len)

@app.route('/recommend/groups', methods=['POST'])
def recommend_groups():
    data = request.json
    user_id = data.get('user_id')
    top_n = data.get('top_n', 10)

    if user_id is None:
        return jsonify({"error": "user_id is required"}), 400

    if user_id not in user_encoder.classes_:
        return jsonify({"error": "user_id not found"}), 404

    internal_user_id = user_encoder.transform([user_id])[0]
    joined_group_ids = joined_groups_df[joined_groups_df['userid'] == user_id]['groupid'].values
    joined_internal_group_ids = group_encoder.transform(joined_group_ids)

    all_internal_group_ids = np.arange(len(group_encoder.classes_))
    unjoined_group_ids = np.setdiff1d(all_internal_group_ids, joined_internal_group_ids)

    unjoined_group_texts = groups_df.loc[groups_df['id'].isin(group_encoder.inverse_transform(unjoined_group_ids)), 'name'] + " " + groups_df['description']
    unjoined_group_sequences = pad_group_text(unjoined_group_texts, group_max_len)

    user_data = np.array([internal_user_id] * len(unjoined_group_ids))
    predicted_scores = group_model.predict([user_data, unjoined_group_ids, unjoined_group_sequences]).flatten()

    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    recommended_group_ids = group_encoder.inverse_transform(unjoined_group_ids[top_indices])

    recommended_groups = groups_df[groups_df['id'].isin(recommended_group_ids)]
    return jsonify(recommended_groups[['id', 'name', 'description']].to_dict(orient='records'))

@app.route('/recommend/posts', methods=['POST'])
def recommend_posts():
    data = request.json
    user_id = data.get('user_id')
    top_n = data.get('top_n', 10)

    if user_id is None:
        return jsonify({"error": "user_id is required"}), 400

    if user_id not in user_encoder.classes_:
        return jsonify({"error": "user_id not found"}), 404

    internal_user_id = user_encoder.transform([user_id])[0]
    saved_post_ids = saved_posts_df[saved_posts_df['userid'] == user_id]['postid'].values
    saved_internal_post_ids = post_encoder.transform(saved_post_ids)

    all_internal_post_ids = np.arange(len(post_encoder.classes_))
    unsaved_post_ids = np.setdiff1d(all_internal_post_ids, saved_internal_post_ids)

    unsaved_post_texts = posts_df.loc[posts_df['id'].isin(post_encoder.inverse_transform(unsaved_post_ids)), 'title'] + " " + posts_df['caption']
    unsaved_post_sequences = pad_post_text(unsaved_post_texts, post_max_len)

    user_data = np.array([internal_user_id] * len(unsaved_post_ids))
    predicted_scores = post_model.predict([user_data, unsaved_post_ids, unsaved_post_sequences]).flatten()

    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    recommended_post_ids = post_encoder.inverse_transform(unsaved_post_ids[top_indices])

    recommended_posts = posts_df[posts_df['id'].isin(recommended_post_ids)]
    return jsonify(recommended_posts[['id', 'title', 'caption']].to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)
