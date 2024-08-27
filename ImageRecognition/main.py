import tensorflow as tf
import os
import cv2
import imghdr
import numpy as np
from matplotlib import pyplot as plt
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten
from tensorflow.keras.metrics import Precision, Recall, BinaryAccuracy
from tensorflow.keras.metrics import SparseCategoricalAccuracy
import time

#############################################################################################################
# cleaning up our images
start_time = time.time()

data_dir = r'ImageRecognition\data' 

image_exts = ['jpeg','jpg', 'bmp', 'png']

for image_class in os.listdir(data_dir):
    print(image_class)

for image_class in os.listdir(data_dir): 
    for image in os.listdir(os.path.join(data_dir, image_class)):
        image_path = os.path.join(data_dir, image_class, image)
        try: 
            img = cv2.imread(image_path)
            tip = imghdr.what(image_path)
            if tip not in image_exts: 
                print('Image not in ext list {}'.format(image_path))
                os.remove(image_path)
        except Exception as e: 
            print('Issue with image {}'.format(image_path))

#############################################################################################################
# Load our data
data = tf.keras.utils.image_dataset_from_directory(r'ImageRecognition\data')
data_iterator = data.as_numpy_iterator()
batch = data_iterator.next()

# fig, ax = plt.subplots(ncols=4, figsize=(20, 20))
# for idx, img in enumerate(batch[0][:4]):
#     ax[idx].imshow(img.astype(int))
#     ax[idx].title.set_text(batch[1][idx])
#plt.show()  # If you want to see random batches from our classes then include this line

#############################################################################################################
# Scale the data
data = data.map(lambda x, y: (x / 255.0, y))

# Fetch a new batch after scaling
scaled_iterator = data.as_numpy_iterator()

batch = scaled_iterator.next()
# Display scaled images (normalized to [0, 1])
fig, ax = plt.subplots(ncols=4, figsize=(20, 20))
for idx, img in enumerate(batch[0][:4]):
    ax[idx].imshow(img) 
    ax[idx].title.set_text(batch[1][idx])
plt.show()

#############################################################################################################
#Splitting our data into training, testing and validation sets
print(f"Length of Data: {len(data)}")
train_size = int(len(data)*.7)
val_size = int(len(data)*.2) + 1
test_size = int(len(data)*.1) + 1

print(f" Training size: {train_size} , validation size: {val_size}, test size: {test_size} \nThe total number of our training size: {train_size+val_size+test_size}")

train = data.take(train_size)
val = data.skip(train_size).take(val_size)
test = data.skip(train_size+val_size).take(test_size)

#############################################################################################################
# Deep learning model
# Update model for multi-class classification
model = Sequential()
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(256,256,3)))
model.add(MaxPooling2D((2, 2)))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(MaxPooling2D((2, 2)))
model.add(Conv2D(64, (3, 3), activation='relu'))
model.add(Flatten())
model.add(Dense(64, activation='relu'))
model.add(Dense(5, activation='softmax'))  # 5 classes for the 5 different animals

# Compile the model with categorical crossentropy loss
model.compile(optimizer='RMSprop', loss=tf.losses.SparseCategoricalCrossentropy(), metrics=['accuracy'])

model.summary()

#############################################################################################################
# Training the model
logdir='logs'
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=logdir)
hist = model.fit(train, epochs= 20, validation_data=val, callbacks=[tensorboard_callback])
model.save(os.path.join(r'ImageRecognition/models','image_classifier.keras'))

#############################################################################################################
# Plotting our performance
# Plotting our loss
fig = plt.figure()
plt.plot(hist.history['loss'], color='teal', label='loss')
plt.plot(hist.history['val_loss'], color='orange', label='val_loss')
fig.suptitle('Loss', fontsize=20)
plt.legend(loc="upper left")
plt.show()

# Plotting our accuracy
fig = plt.figure()
plt.plot(hist.history['accuracy'], color='teal', label='accuracy')
plt.plot(hist.history['val_accuracy'], color='orange', label='val_accuracy')
fig.suptitle('Accuracy', fontsize=20)
plt.legend(loc="upper left")
plt.show()

#############################################################################################################
# Evaluating the model
acc = SparseCategoricalAccuracy()
for batch in test.as_numpy_iterator(): 
    X, y = batch
    yhat = model.predict(X)
    acc.update_state(y, yhat)

print("Sparse Categorical Accuracy:", acc.result().numpy())

#############################################################################################################
# Testing our model works now

saved_model = load_model(r'ImageRecognition/models/image_classifier.keras')

# Load and preprocess the test image
img = cv2.imread(r'ImageRecognition/Lion.jpg')
img = tf.image.resize(img, (256, 256))  # Resize to model input size
img = img / 255.0  # Normalize to [0, 1]

# Predict class probabilities
yhat = saved_model.predict(np.expand_dims(img, 0))

# Determine predicted class
class_names = ['buffalo', 'elephant', 'leopard', 'lion', 'rhino']
predicted_class_index = np.argmax(yhat)
predicted_class_name = class_names[predicted_class_index]

# Get the probability of the predicted class
predicted_probability = yhat[0][predicted_class_index]

# Define the threshold
threshold = 0.60

print(f'Probabilities: {yhat}')

# Check if the prediction is conclusive
if predicted_probability >= threshold:
    print(f'Predicted class: {predicted_class_name} with probability {predicted_probability:.2f}')
else:
    print('Prediction not conclusive. The highest probability is below the threshold.')
    print(f'Highest probability class: {class_names[predicted_class_index]} with probability {predicted_probability:.2f}')

print("--- %s minutes ---" % ((time.time() - start_time) / 60))
    
#############################################################################################################