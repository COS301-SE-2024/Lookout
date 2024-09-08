from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os

app = Flask(__name__)

############################################# LOADING DATA ##########################################

# Set up file paths
data_folder = os.path.join(os.path.dirname(__file__), 'data')
users_csv_path = os.path.join(data_folder, 'users.csv')
saved_posts_csv_path = os.path.join(data_folder, 'saved_posts.csv')
posts_csv_path = os.path.join(data_folder, 'posts.csv')

# Load data
users_df = pd.read_csv(users_csv_path)
saved_posts_df = pd.read_csv(saved_posts_csv_path)
posts_df = pd.read_csv(posts_csv_path)

# Encode user and post IDs
user_encoder = LabelEncoder()
post_encoder = LabelEncoder()

# Ensure post_encoder is fit on all post IDs from posts_df
post_encoder.fit(posts_df['id'])

saved_posts_df['userId'] = user_encoder.fit_transform(saved_posts_df['userid'])
saved_posts_df['postId'] = post_encoder.transform(saved_posts_df['postid'])

num_users = len(user_encoder.classes_)
num_posts = len(post_encoder.classes_)

# Tokenize post titles and descriptions
tokenizer = tf.keras.preprocessing.text.Tokenizer()
posts_df['text'] = posts_df['title'] + " " + posts_df['caption']
tokenizer.fit_on_texts(posts_df['text'])
vocab_size = len(tokenizer.word_index) + 1

# Convert text to sequences
posts_df['text_seq'] = tokenizer.texts_to_sequences(posts_df['text'])
max_seq_length = max(posts_df['text_seq'].apply(len))
post_text_sequences = pad_sequences(posts_df['text_seq'], maxlen=max_seq_length)

# Load the model
model = tf.keras.models.load_model('post_recommendation_model.keras')

############################################# RECOMMEND POSTS ##################################################

def recommend_posts(user_id, top_n=10):
    # Transform user_id to internal ID
    internal_user_id = user_encoder.transform([user_id])[0]

    # Get the posts that the user has already saved
    saved_post_ids = saved_posts_df[saved_posts_df['userid'] == user_id]['postid'].values
    user_created_post_ids = posts_df[posts_df['userid'] == user_id]['id'].values

    # Get the internal post IDs for the saved posts
    saved_internal_post_ids = post_encoder.transform(saved_post_ids)

    # Exclude saved and user-created posts from the recommendation process
    all_internal_post_ids = np.arange(num_posts)
    unsaved_internal_post_ids = np.setdiff1d(all_internal_post_ids, np.union1d(saved_internal_post_ids, user_created_post_ids))

    # Get the corresponding text sequences for the unsaved posts
    unsaved_post_texts = post_text_sequences[unsaved_internal_post_ids]

    # Predict scores for the unsaved posts for the given user
    user_data = np.array([internal_user_id] * len(unsaved_internal_post_ids))
    post_data = unsaved_internal_post_ids

    predicted_scores = model.predict([user_data, post_data, unsaved_post_texts]).flatten()

    # Get top N posts by score
    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    top_internal_post_ids = unsaved_internal_post_ids[top_indices]

    # Convert internal post IDs back to original post IDs
    recommended_posts = posts_df.loc[posts_df['id'].isin(post_encoder.inverse_transform(top_internal_post_ids))]

    return recommended_posts[['id', 'title', 'caption']].to_dict(orient='records')

############################################# FLASK ENDPOINT ##################################################

@app.route('/recommend_posts', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    top_n = request.args.get('top_n', default=10, type=int)
    
    if user_id is None:
        return jsonify({'error': 'Please provide a user_id'}), 400

    try:
        recommended_posts = recommend_posts(user_id=user_id, top_n=top_n)
        return jsonify(recommended_posts)
    except ValueError:
        return jsonify({'error': 'Invalid user_id provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
