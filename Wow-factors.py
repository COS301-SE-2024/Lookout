from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
from flask_cors import CORS
import cv2
import requests


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


############################################# RECOMMENDATION SYSTEM ##########################################

# Set up file paths
data_folder_posts = os.path.join(os.path.dirname(__file__), 'Recommendation_Models/Post_Model/data')
data_folder_groups = os.path.join(os.path.dirname(__file__), 'Recommendation_Models/Groups_Model/data')

# Correct file paths
users_csv_path = os.path.join(data_folder_groups, 'users.csv')
saved_posts_csv_path = os.path.join(data_folder_posts, 'saved_posts.csv')
posts_csv_path = os.path.join(data_folder_posts, 'posts.csv')
groups_csv_path = os.path.join(data_folder_groups, 'groups.csv')
joined_groups_csv_path = os.path.join(data_folder_groups, 'joined_groups.csv')


# Load data
users_df = pd.read_csv(users_csv_path)
saved_posts_df = pd.read_csv(saved_posts_csv_path)
posts_df = pd.read_csv(posts_csv_path)
groups_df = pd.read_csv(groups_csv_path)
joined_groups_df = pd.read_csv(joined_groups_csv_path)

# Initialize encoders for posts
user_encoder_posts = LabelEncoder()
post_encoder = LabelEncoder()
post_encoder.fit(posts_df['id'])
saved_posts_df['userId'] = user_encoder_posts.fit_transform(saved_posts_df['userid'])
saved_posts_df['postId'] = post_encoder.transform(saved_posts_df['postid'])

# Initialize encoders for groups
user_encoder_groups = LabelEncoder()
group_encoder = LabelEncoder()
user_encoder_groups.fit(users_df['id'])
group_encoder.fit(groups_df['id'])

# Tokenize and prepare sequences for posts
tokenizer_posts = tf.keras.preprocessing.text.Tokenizer()
posts_df['text'] = posts_df['title'] + " " + posts_df['caption']
tokenizer_posts.fit_on_texts(posts_df['text'])
posts_df['text_seq'] = tokenizer_posts.texts_to_sequences(posts_df['text'])
max_seq_length_posts = max(posts_df['text_seq'].apply(len))
post_text_sequences = pad_sequences(posts_df['text_seq'], maxlen=max_seq_length_posts)

# Tokenize and prepare sequences for groups
tokenizer_groups = tf.keras.preprocessing.text.Tokenizer()
groups_df['text'] = groups_df['name'] + " " + groups_df['description']
tokenizer_groups.fit_on_texts(groups_df['text'])
groups_df['text_seq'] = tokenizer_groups.texts_to_sequences(groups_df['text'])
max_seq_length_groups = max(groups_df['text_seq'].apply(len))
group_text_sequences = pad_sequences(groups_df['text_seq'], maxlen=max_seq_length_groups)

# Load models
model_posts = tf.keras.models.load_model('Recommendation_Models/Post_Model/post_recommendation_model.keras')
model_groups = tf.keras.models.load_model('Recommendation_Models/Groups_Model/group_recommendation_model.keras')


############################################# RECOMMEND POSTS ##################################################
def most_saved_posts():
    top_n = request.args.get('top_n', default=10, type=int)
    post_save_counts = saved_posts_df.groupby('postid').size().reset_index(name='save_count')
    top_saved_posts = post_save_counts.sort_values('save_count', ascending=False).head(top_n)
    top_post_details = posts_df[posts_df['id'].isin(top_saved_posts['postid'])]
    result = pd.merge(top_post_details, top_saved_posts, left_on='id', right_on='postid')
    result = result[['id', 'userid', 'groupId', 'categoryId', 'title', 'caption', 'picture', 'latitude', 'longitude', 'save_count']].sort_values('save_count', ascending=False)

    return jsonify(result.to_dict(orient='records'))

def recommend_posts(user_id, top_n=10):
    internal_user_id = user_encoder_posts.transform([user_id])[0]
    saved_post_ids = saved_posts_df[saved_posts_df['userid'] == user_id]['postid'].values
    user_created_post_ids = posts_df[posts_df['userid'] == user_id]['id'].values
    saved_internal_post_ids = post_encoder.transform(saved_post_ids)
    all_internal_post_ids = np.arange(len(post_encoder.classes_))
    unsaved_internal_post_ids = np.setdiff1d(all_internal_post_ids, np.union1d(saved_internal_post_ids, user_created_post_ids))
    unsaved_post_texts = post_text_sequences[unsaved_internal_post_ids]
    user_data = np.array([internal_user_id] * len(unsaved_internal_post_ids))
    post_data = unsaved_internal_post_ids
    predicted_scores = model_posts.predict([user_data, post_data, unsaved_post_texts]).flatten()
    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    top_internal_post_ids = unsaved_internal_post_ids[top_indices]
    recommended_posts = posts_df.loc[posts_df['id'].isin(post_encoder.inverse_transform(top_internal_post_ids))]
    return recommended_posts[['id','userid','groupId','categoryId','title','caption','picture','latitude','longitude']].to_dict(orient='records')

@app.route('/recommend_posts', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    top_n = request.args.get('top_n', default=10, type=int)
    if user_id is None:
        recommended_posts = most_saved_posts()
        return recommended_posts
    try:
        recommended_posts = recommend_posts(user_id=user_id, top_n=top_n)
        return jsonify(recommended_posts)
    except ValueError:
        recommended_posts = most_saved_posts()
        return recommended_posts
    
############################################# RECOMMEND GROUPS ##################################################
def most_joined_groups():

    top_n = request.args.get('top_n', default=10, type=int)
    group_join_counts = joined_groups_df.groupby('groupid').size().reset_index(name='join_count')
    top_joined_groups = group_join_counts.sort_values('join_count', ascending=False).head(top_n)
    top_group_details = groups_df[groups_df['id'].isin(top_joined_groups['groupid'])]
    result = pd.merge(top_group_details, top_joined_groups, left_on='id', right_on='groupid')
    result = result[['id', 'name', 'description', 'join_count']].sort_values('join_count', ascending=False)
    return result.to_dict(orient='records')

def recommend_groups(user_id, top_n=10):
    internal_user_id = user_encoder_groups.transform([user_id])[0]
    joined_group_ids = joined_groups_df[joined_groups_df['userid'] == user_id]['groupid'].values
    joined_internal_group_ids = group_encoder.transform(joined_group_ids)
    user_created_group_ids = groups_df[groups_df['userId'] == user_id]['id'].values
    user_created_internal_group_ids = group_encoder.transform(user_created_group_ids)
    all_internal_group_ids = np.arange(len(group_encoder.classes_))
    unjoined_and_uncreated_internal_group_ids = np.setdiff1d(all_internal_group_ids, np.union1d(joined_internal_group_ids, user_created_internal_group_ids))
    unjoined_and_uncreated_group_texts = group_text_sequences[unjoined_and_uncreated_internal_group_ids]
    user_data = np.array([internal_user_id] * len(unjoined_and_uncreated_internal_group_ids))
    group_data = unjoined_and_uncreated_internal_group_ids
    predicted_scores = model_groups.predict([user_data, group_data, unjoined_and_uncreated_group_texts]).flatten()
    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    top_internal_group_ids = unjoined_and_uncreated_internal_group_ids[top_indices]
    recommended_group_ids = group_encoder.inverse_transform(top_internal_group_ids)
    recommended_groups = groups_df[groups_df['id'].isin(recommended_group_ids)][['id', 'name', 'description']]
    return recommended_groups.to_dict(orient='records')

@app.route('/recommend_groups', methods=['GET'])
def recommend_groups_route():
    user_id = int(request.args.get('user_id'))
    top_n = int(request.args.get('top_n', 10))
    if user_id is None:
        recommended_groups = most_joined_groups()
        return jsonify(recommended_groups)
    try:
        recommended_groups = recommend_groups(user_id=user_id, top_n=top_n)
        return jsonify(recommended_groups)
    except Exception as e:
        recommended_groups = most_joined_groups()
        return jsonify(recommended_groups)


############################################# IMAGE CLASSIFICATION ##########################################

# Load your pre-trained image classification model
saved_model = tf.keras.models.load_model('ImageRecognition/models/image_classifier.keras')

# Define the class names
class_names = ['buffalo', 'elephant', 'leopard', 'lion', 'rhino']


def load_and_preprocess_image(image_data):
    # Convert the image to an OpenCV format, resize and normalize
    img = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_COLOR)
    img = cv2.resize(img, (256, 256))  # Resize to model input size
    img = img / 255.0  # Normalize to [0, 1]
    return img


@app.route('/predict', methods=['POST'])
def predict():
    # Check if an image is in the request
    if 'image' in request.files:
        # Process uploaded image file
        file = request.files['image']
        image_data = file.read()
    elif 'image_url' in request.json:
        # Process image from URL
        image_url = request.json['image_url']
        try:
            response = requests.get(image_url)
            if response.status_code != 200:
                return jsonify({'error': 'Failed to download image from URL'}), 400
            image_data = response.content
        except Exception as e:
            return jsonify({'error': str(e)}), 400
    else:
        return jsonify({'error': 'No image uploaded or URL provided'}), 400

    # Load and preprocess image
    img = load_and_preprocess_image(image_data)

    # Predict class probabilities
    yhat = saved_model.predict(np.expand_dims(img, 0))

    # Determine predicted class
    predicted_class_index = np.argmax(yhat)
    predicted_class_name = class_names[predicted_class_index].capitalize() + " Sighting"
    predicted_probability = yhat[0][predicted_class_index]

    # Return the prediction
    return jsonify({
        'predicted_class': predicted_class_name,
        'probability': float(predicted_probability)
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000) 