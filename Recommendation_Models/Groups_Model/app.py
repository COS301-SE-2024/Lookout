from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences
import tensorflow as tf
import os
import requests
import io

app = Flask(__name__)

# Load preprocessed data
data_folder = os.path.join(os.path.dirname(__file__), 'data')
users_csv_path = os.path.join(data_folder, 'users.csv')
groups_csv_path = os.path.join(data_folder, 'groups.csv')
joined_groups_csv_path = os.path.join(data_folder, 'joined_groups.csv')

users_df = pd.read_csv(users_csv_path)
groups_df = pd.read_csv(groups_csv_path)
joined_groups_df = pd.read_csv(joined_groups_csv_path)

# Initialize encoders
user_encoder = LabelEncoder()
group_encoder = LabelEncoder()

# Fit encoders on user and group IDs
user_encoder.fit(users_df['id'])
group_encoder.fit(groups_df['id'])

# Tokenize group names and descriptions
groups_df['text'] = groups_df['name'] + " " + groups_df['description']
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(groups_df['text'])
vocab_size = len(tokenizer.word_index) + 1

# Convert text to sequences
groups_df['text_seq'] = tokenizer.texts_to_sequences(groups_df['text'])
max_seq_length = max(groups_df['text_seq'].apply(len))
group_text_sequences = pad_sequences(groups_df['text_seq'], maxlen=max_seq_length)

# Load the trained model
model = tf.keras.models.load_model('group_recommendation_model.keras')

@app.route('/recommend_groups', methods=['GET'])
def recommend_groups():
    try:
        # Get user ID from the request parameters
        user_id = int(request.args.get('user_id'))
        top_n = int(request.args.get('top_n', 10))

        # Get the internal user ID
        internal_user_id = user_encoder.transform([user_id])[0]
        
        # Get the groups that the user has already joined
        joined_group_ids = joined_groups_df[joined_groups_df['userid'] == user_id]['groupid'].values
        
        # Get the internal group IDs for the joined groups
        joined_internal_group_ids = group_encoder.transform(joined_group_ids)
        
        # Get the groups that the user has created
        user_created_group_ids = groups_df[groups_df['userId'] == user_id]['id'].values
        user_created_internal_group_ids = group_encoder.transform(user_created_group_ids)
        
        # Exclude the joined and created groups from recommendations
        all_internal_group_ids = np.arange(len(group_encoder.classes_))
        unjoined_and_uncreated_internal_group_ids = np.setdiff1d(all_internal_group_ids, np.union1d(joined_internal_group_ids, user_created_internal_group_ids))
        
        # Get the corresponding text sequences for the unjoined and uncreated groups
        unjoined_and_uncreated_group_texts = group_text_sequences[unjoined_and_uncreated_internal_group_ids]
        
        # Predict scores for the unjoined and uncreated groups
        user_data = np.array([internal_user_id] * len(unjoined_and_uncreated_internal_group_ids))
        group_data = unjoined_and_uncreated_internal_group_ids

        predicted_scores = model.predict([user_data, group_data, unjoined_and_uncreated_group_texts]).flatten()

        # Get top N groups
        top_indices = np.argsort(predicted_scores)[::-1][:top_n]
        top_internal_group_ids = unjoined_and_uncreated_internal_group_ids[top_indices]

        recommended_group_ids = group_encoder.inverse_transform(top_internal_group_ids)

        # Retrieve the recommended groups' data
        recommended_groups = groups_df[groups_df['id'].isin(recommended_group_ids)][['id', 'name', 'description']]

        return jsonify(recommended_groups.to_dict(orient='records'))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
