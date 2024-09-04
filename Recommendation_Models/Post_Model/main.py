import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

############################################# LOADING, LABELLING & SPLITTING DATA ##########################################

# Label data
users_df = pd.read_csv('data/users.csv')
posts_df = pd.read_csv('data/posts.csv')
saved_posts_df = pd.read_csv('data/saved_posts.csv')

# Encode user and post IDs
user_encoder = LabelEncoder()
post_encoder = LabelEncoder()

saved_posts_df['userId'] = user_encoder.fit_transform(saved_posts_df['userid'])
saved_posts_df['postId'] = post_encoder.fit_transform(saved_posts_df['postid'])

num_users = len(user_encoder.classes_)
num_posts = len(post_encoder.classes_)

# Tokenize post titles and captions
tokenizer = Tokenizer()
posts_df['text'] = posts_df['title'] + " " + posts_df['caption']
tokenizer.fit_on_texts(posts_df['text'])
vocab_size = len(tokenizer.word_index) + 1

# Convert text to sequences
posts_df['text_seq'] = tokenizer.texts_to_sequences(posts_df['text'])
max_seq_length = max(posts_df['text_seq'].apply(len))
post_text_sequences = pad_sequences(posts_df['text_seq'], maxlen=max_seq_length)

# Split data into training and testing sets
train_data, test_data = train_test_split(saved_posts_df, test_size=0.2, random_state=42)

##################################################### TRAINING DATA ######################################################

# Extract features and labels for training
train_user_data = train_data['userId'].values 
train_post_data = train_data['postId'].values 
train_post_text = post_text_sequences[train_post_data]

# Create labels for positive interactions and non-interactions
train_labels = np.ones(len(train_data))

# Add some negative samples (non-interactions) 
num_negative_samples = len(train_data) // 2
negative_samples = train_data.sample(num_negative_samples, random_state=42)
negative_samples['id'] = 0  # Label non-interactions as 0
train_data_combined = pd.concat([train_data, negative_samples], axis=0)

train_user_data_combined = train_data_combined['userId'].values
train_post_data_combined = train_data_combined['postId'].values
train_post_text_combined = post_text_sequences[train_post_data_combined]

# 1 refers to positive interaction (post saved) and 0 refers to a negative interaction (post not saved)
train_labels_combined = np.concatenate([train_labels, np.zeros(num_negative_samples)])

##################################################### TESTING DATA ######################################################

# Extract features and labels for testing
test_user_data = test_data['userId'].values
test_post_data = test_data['postId'].values
test_post_text = post_text_sequences[test_post_data]

# Create labels for positive interactions and non-interactions
test_labels = np.ones(len(test_data))

# Add some negative samples (non-interactions) 
num_negative_samples_test = len(test_data) // 2
negative_samples_test = test_data.sample(num_negative_samples_test, random_state=42)
negative_samples_test['id'] = 0
test_data_combined = pd.concat([test_data, negative_samples_test], axis=0)

test_user_data_combined = test_data_combined['userId'].values
test_post_data_combined = test_data_combined['postId'].values
test_post_text_combined = post_text_sequences[test_post_data_combined]

# 1 refers to positive interaction (post saved) and 0 refers to a negative interaction (post not saved)
test_labels_combined = np.concatenate([test_labels, np.zeros(num_negative_samples_test)])

################################################### SETTING UP THE MODEL ####################################################

# VECTOR SIZES - each user and post is represented by a vector of 50 
embedding_size = 50

# INPUT LAYERS
user_input = layers.Input(shape=(1,), name='user_input') # as defined by shape input is a single integer
post_input = layers.Input(shape=(1,), name='post_input')
text_input = layers.Input(shape=(max_seq_length,), name='text_input')

# Embedding layers for user and post IDs
user_embedding = layers.Embedding(input_dim=num_users, output_dim=embedding_size, name='user_embedding')(user_input) 
post_embedding = layers.Embedding(input_dim=num_posts, output_dim=embedding_size, name='post_embedding')(post_input)

# Embedding layer for text (title and caption)
text_embedding = layers.Embedding(input_dim=vocab_size, output_dim=embedding_size, name='text_embedding')(text_input)
text_vec = layers.GlobalAveragePooling1D()(text_embedding)

# Flatten embeddings for user and post IDs
user_vec = layers.Flatten()(user_embedding)
post_vec = layers.Flatten()(post_embedding)

# Concatenate user, post, and text vectors
concat = layers.Concatenate()([user_vec, post_vec, text_vec])

# Dense layers
dense = layers.Dense(128, activation='relu')(concat) # dense neural network layer with 128 units
dense = layers.Dense(64, activation='relu')(dense) # dense neural network layer with 64 units
output = layers.Dense(1, activation='sigmoid')(dense) # dense neural network layer with 1 units

################################################## THE MODEL AND ACCURACY ##################################################
model = Model(inputs=[user_input, post_input, text_input], outputs=output)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    [train_user_data_combined, train_post_data_combined, train_post_text_combined],
    train_labels_combined,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)

# Evaluate the model - TRAINING
train_loss, train_accuracy = model.evaluate([train_user_data_combined, train_post_data_combined, train_post_text_combined], train_labels_combined)
print(f"Train Loss: {train_loss}, Train Accuracy: {train_accuracy}")

# Evaluate the model - TESTING
test_loss, test_accuracy = model.evaluate([test_user_data_combined, test_post_data_combined, test_post_text_combined], test_labels_combined)
print(f"Test Loss: {test_loss}, Test Accuracy: {test_accuracy}")

###################################################### RECOMMEND THE POSTS ##################################################
def recommend_posts(user_id, top_n=10):
    # Get the posts that have already been saved by the user
    saved_post_ids = saved_posts_df[saved_posts_df['userid'] == user_id]['postid'].values
    
    # Get the posts that have been created by the user
    user_created_post_ids = posts_df[posts_df['userid'] == user_id]['id'].values
    
    # Exclude the saved posts and the posts created by the user from the recommendation process
    all_post_ids = np.arange(num_posts)
    unsaved_and_uncreated_post_ids = np.setdiff1d(all_post_ids, np.union1d(saved_post_ids, user_created_post_ids))
    
    # Get the corresponding text sequences for the unsaved and uncreated posts
    unsaved_and_uncreated_post_texts = post_text_sequences[unsaved_and_uncreated_post_ids]
    
    # Predict scores for the unsaved and uncreated posts for the given user
    user_data = np.array([user_id] * len(unsaved_and_uncreated_post_ids))
    post_data = unsaved_and_uncreated_post_ids
    predicted_scores = model.predict([user_data, post_data, unsaved_and_uncreated_post_texts]).flatten()
    
    # Get top N posts
    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    top_post_ids = unsaved_and_uncreated_post_ids[top_indices]
    
    # Map post IDs to post titles for recommended posts
    recommended_posts = posts_df.loc[posts_df['id'].isin(post_encoder.inverse_transform(top_post_ids))]
    
    # Print the posts created by the user
    print("Posts created by the user:")
    created_posts = posts_df.loc[posts_df['id'].isin(user_created_post_ids)]
    print(created_posts[['title', 'caption']])
    
    # Print the posts saved by the user
    print("\nPosts saved by the user:")
    saved_posts = posts_df.loc[posts_df['id'].isin(post_encoder.inverse_transform(saved_post_ids))]
    print(saved_posts[['title', 'caption']])
    
    # Print the recommended posts
    print("\nRecommended posts:")
    print(recommended_posts[['title', 'caption']])
    
    return recommended_posts

# Example: Recommend posts for user with ID 0
recommended_posts = recommend_posts(user_id=2, top_n=10)

# Save the model
model.save('recommendation_model.keras')

# Load the model
loaded_model = tf.keras.models.load_model('recommendation_model.keras')
