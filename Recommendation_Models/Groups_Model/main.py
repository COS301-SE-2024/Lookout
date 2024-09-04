import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

############################################# LOADING, LABELLING & SPLITTING DATA ##########################################

# Load + preprocess 
users_df = pd.read_csv('data/users.csv')
groups_df = pd.read_csv('data/groups.csv')
joined_groups_df = pd.read_csv('data/joined_groups.csv')

# Encode user and group IDs
user_encoder = LabelEncoder()
group_encoder = LabelEncoder()

# Ensure group_encoder is fit on all group IDs from groups_df
group_encoder.fit(groups_df['id'])

joined_groups_df['userId'] = user_encoder.fit_transform(joined_groups_df['userid'])
joined_groups_df['groupId'] = group_encoder.transform(joined_groups_df['groupid'])

num_users = len(user_encoder.classes_)
num_groups = len(group_encoder.classes_)

# Tokenize group names and descriptions
tokenizer = Tokenizer()
groups_df['text'] = groups_df['name'] + " " + groups_df['description']
tokenizer.fit_on_texts(groups_df['text'])
vocab_size = len(tokenizer.word_index) + 1

# Convert text to sequences
groups_df['text_seq'] = tokenizer.texts_to_sequences(groups_df['text'])
max_seq_length = max(groups_df['text_seq'].apply(len))
group_text_sequences = pad_sequences(groups_df['text_seq'], maxlen=max_seq_length)

# Split data into training and testing sets
train_data, test_data = train_test_split(joined_groups_df, test_size=0.2, random_state=42)

##################################################### TRAINING DATA ######################################################

# Extract features and labels for training
train_user_data = train_data['userId'].values
train_group_data = train_data['groupId'].values
train_group_text = group_text_sequences[train_group_data]

# Create labels for positive interactions (joined groups) and non-interactions
train_labels = np.ones(len(train_data))

# Add some negative samples (non-interactions)
num_negative_samples = len(train_data) // 2
negative_samples = train_data.sample(num_negative_samples, random_state=42)
negative_samples['id'] = 0  # Label non-interactions as 0
train_data_combined = pd.concat([train_data, negative_samples], axis=0)

train_user_data_combined = train_data_combined['userId'].values
train_group_data_combined = train_data_combined['groupId'].values
train_group_text_combined = group_text_sequences[train_group_data_combined]

# 1 refers to positive interaction (group joined) and 0 refers to a negative interaction (group not joined)
train_labels_combined = np.concatenate([train_labels, np.zeros(num_negative_samples)])

##################################################### TESTING DATA ######################################################

# Testing data preparation
test_user_data = test_data['userId'].values
test_group_data = test_data['groupId'].values
test_group_text = group_text_sequences[test_group_data]

# Create labels for positive interactions and non-interactions
test_labels = np.ones(len(test_data))

# Add some negative samples (non-interactions)
num_negative_samples_test = len(test_data) // 2
negative_samples_test = test_data.sample(num_negative_samples_test, random_state=42)
negative_samples_test['id'] = 0
test_data_combined = pd.concat([test_data, negative_samples_test], axis=0)

test_user_data_combined = test_data_combined['userId'].values
test_group_data_combined = test_data_combined['groupId'].values
test_group_text_combined = group_text_sequences[test_group_data_combined]

test_labels_combined = np.concatenate([test_labels, np.zeros(num_negative_samples_test)])

################################################### SETTING UP THE MODEL ####################################################

embedding_size = 50

user_input = layers.Input(shape=(1,), name='user_input')
group_input = layers.Input(shape=(1,), name='group_input')
text_input = layers.Input(shape=(max_seq_length,), name='text_input')

user_embedding = layers.Embedding(input_dim=num_users, output_dim=embedding_size, name='user_embedding')(user_input)
group_embedding = layers.Embedding(input_dim=num_groups, output_dim=embedding_size, name='group_embedding')(group_input)

text_embedding = layers.Embedding(input_dim=vocab_size, output_dim=embedding_size, name='text_embedding')(text_input)
text_vec = layers.GlobalAveragePooling1D()(text_embedding)

user_vec = layers.Flatten()(user_embedding)
group_vec = layers.Flatten()(group_embedding)

concat = layers.Concatenate()([user_vec, group_vec, text_vec])

dense = layers.Dense(128, activation='relu')(concat)
dense = layers.Dense(64, activation='relu')(dense)
output = layers.Dense(1, activation='sigmoid')(dense)

################################################## THE MODEL AND ACCURACY ##################################################

model = Model(inputs=[user_input, group_input, text_input], outputs=output)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(
    [train_user_data_combined, train_group_data_combined, train_group_text_combined],
    train_labels_combined,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)

# Evaluate the model
train_loss, train_accuracy = model.evaluate([train_user_data_combined, train_group_data_combined, train_group_text_combined], train_labels_combined)
print(f"Train Loss: {train_loss}, Train Accuracy: {train_accuracy}")

test_loss, test_accuracy = model.evaluate([test_user_data_combined, test_group_data_combined, test_group_text_combined], test_labels_combined)
print(f"Test Loss: {test_loss}, Test Accuracy: {test_accuracy}")

###################################################### RECOMMEND THE POSTS ##################################################

def recommend_groups(user_id, top_n=10):
    # Get the internal user ID
    internal_user_id = user_encoder.transform([user_id])[0]
    
    # Get the groups that the user has already joined
    joined_group_ids = joined_groups_df[joined_groups_df['userid'] == user_id]['groupid'].values
    
    # Get the internal group IDs
    joined_internal_group_ids = group_encoder.transform(joined_group_ids)

    # Get the groups that the user has created
    user_created_group_ids = groups_df[groups_df['userId'] == user_id]['id'].values
    user_created_internal_group_ids = group_encoder.transform(user_created_group_ids)
    
    # Exclude the joined groups and the groups created by the user from the recommendation process
    all_internal_group_ids = np.arange(num_groups)
    unjoined_and_uncreated_internal_group_ids = np.setdiff1d(all_internal_group_ids, np.union1d(joined_internal_group_ids, user_created_internal_group_ids))
    
    # Get the corresponding text sequences for the unjoined and uncreated groups
    unjoined_and_uncreated_group_texts = group_text_sequences[unjoined_and_uncreated_internal_group_ids]
    
    # Predict scores for the unjoined and uncreated groups for the given user
    user_data = np.array([internal_user_id] * len(unjoined_and_uncreated_internal_group_ids))
    group_data = unjoined_and_uncreated_internal_group_ids
    predicted_scores = model.predict([user_data, group_data, unjoined_and_uncreated_group_texts]).flatten()
    
    # Get top N groups
    top_indices = np.argsort(predicted_scores)[::-1][:top_n]
    top_internal_group_ids = unjoined_and_uncreated_internal_group_ids[top_indices]
    
    # Filter out any unseen labels
    seen_labels = set(group_encoder.classes_)
    valid_group_ids = [group_id for group_id in top_internal_group_ids if group_id in seen_labels]

    # If there are valid group IDs, inverse transform them to get actual group IDs
    if valid_group_ids:
        recommended_groups = groups_df.loc[groups_df['id'].isin(group_encoder.inverse_transform(valid_group_ids))]
    else:
        recommended_groups = pd.DataFrame()  # or handle as per your logic

    # Print the groups created by the user
    print("Groups created by the user:")
    created_groups = groups_df.loc[groups_df['id'].isin(user_created_group_ids)]
    print(created_groups[['name', 'description']])
    
    # Print the groups joined by the user
    print("\nGroups joined by the user:")
    joined_groups = groups_df.loc[groups_df['id'].isin(joined_group_ids)]
    print(joined_groups[['name', 'description']])
    
    # Print the recommended groups
    print("\nRecommended groups:")
    print(recommended_groups[['name', 'description']])
    
    return recommended_groups

# Example: Recommend groups for user with ID 0
recommended_groups = recommend_groups(user_id=3, top_n=10)

# Save the model
model.save('group_recommendation_model.keras')

# Load the model
loaded_model = tf.keras.models.load_model('group_recommendation_model.keras')
