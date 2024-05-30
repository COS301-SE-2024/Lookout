# LOOKOUT

## Introduction

Lookout is a modern Progressive Web Application that envisions a user-friendly platform revolutionizing how nature enthusiasts, conservationists, and hikers interact with and share information about their experiences in the outdoors. Lookout focuses on two main functionalities: Proof of sightings and Social interaction. It will allow users to download the application as a PWA to their native mobile devices, enabling easy access and usage on the go. The application is not just a tool limited to recording animal sightings; it's a community-driven platform that brings together nature enthusiasts from around the world. By combining modern technologies with a user-friendly interface, Lookout aims to enhance the animal spotting experience, making it more social, interactive, and rewarding for users.

## Objectives

The high-level objectives for the project are:

1. Facilitate users with the ability to geo-tag various activities and points of interest such as animal sightings, camping locations, and security concerns.
2. Create a modern and intuitive user interface that improves upon outdated solutions, making it easy for users to log and share points of interest.
3. Allow users to utilize the device’s location services to accurately log the geographic coordinates of points of interest.
4. Provide offline accessibility where users are still able to log points of interest without an active internet connection and sync the data once connectivity is restored.
5. Enable users to create, join, search for, and manage groups based on their interests in activities like animal spotting, hiking, and nature conservation.
6. Provide geographical heat maps that display points of interest by category, helping users to quickly identify areas with high activity or specific concerns.
7. Allow users to sign in using their Gmail addresses to streamline the authentication process and enhance security.
8. Facilitate the reporting of security concerns such as broken fences or other hazards, enhancing the safety of outdoor activities.

A need for such an application exists as the growing community of hikers, conservationists, and nature enthusiasts in general currently rely on outdated solutions for documenting and sharing their experiences in natural settings. These existing platforms unsuccessfully integrate modern technologies and lack the ability to effectively highlight the locations of points of interest. Lookout aims to provide a solution to this problem by providing an innovative app, incorporating geo-tagging and information sharing that essentially aims to meet the needs of these users.

## Scope

Lookout will make use of React for a responsive, dynamic frontend and SpringBoot with Kotlin for a reliable backend. PostgreSQL hosted on AWS will manage data, while the application will be deployed on AWS EC2 instances for scalable infrastructure. The frontend will communicate with the backend to process data requests which will ensure efficient interactions. Security measures will include but are not only limited to OAuth 2.0 for secure Gmail-based authentication and Branca tokens for maintaining secure communication between frontend and backend and to guarantee data integrity and prevent unauthorized access.

## User Characteristics

The users of the system fall into two categories:
1. **Non-admin Users**: General users of the system such as nature enthusiasts, conservationists, and hikers.
2. **Admin Users**: Users who own some type of organization such as a nature reserve and can control to some extent the users who can be part of such organization. These users can do everything a non-admin user can do in addition to admin work.

## User Stories

### As a non-admin user:

- I can download the application as a PWA so that I can use it on my mobile phone.
- I can sign in using my Gmail address so that I can quickly access my account.
- I can use the native camera to take photos of points of interest so that I can capture visual information.
- I can use my device’s location service to log the location of the points of interest so that the exact spot is recorded.
- I can post photos of points of interest with their current location and a caption so that I can describe what I have seen.
- I can see a geographical heat-map of points of interest by category (e.g., camping sites, security concerns) so that I can easily find relevant locations.
- I can see a consolidated map of all points of interest in my group so that I can view shared locations with my group members.
- I can search for groups so that I can find and join groups that match my interests.
- I can join groups so that I can collaborate and share information with other members.
- I can use the PWA offline so that I can still log points of interest without an internet connection.
- I can make posts offline that will be saved locally and sent to the server when I have an internet connection so that my data is not lost.
- I can create groups so that I can organize members with similar interests.
- I can manage groups (e.g., invite members, remove members) so that I can control group membership.

### As an admin user:

- I can do everything a non-admin user can do.
- I can create events for my organization.
- I can add tags to my organization.
- I can add or remove non-admin users to my organization (/ban non-admin users from my organization).

## Service Contracts

### Technology Stack

- **Frontend**: React will be used to build the user interface of Lookout.
  - It provides a dynamic, responsive UI with reusable components and efficient updates via the virtual DOM, enhancing the user experience.
- **Backend**: SpringBoot with Kotlin will be used to form the server-side logic and API layer of Lookout.
  - SpringBoot offers a simplified set-up and robust features together ensuring a reliable backend with Kotlin’s concise syntax.
- **Database**: PostgreSQL hosted on AWS will store and manage data such as user profiles, posts, and groups.
  - PostgreSQL provides advanced querying capabilities and supports JSON data which will ensure reliable and efficient data management.
- **Deployment**: AWS EC2 INSTANCE provides the necessary infrastructure for hosting Lookout.
  - AWS offers scalable, affordable solutions with essential services such as monitoring and load balancing.

### Overall Interaction

The frontend will send requests to the backend for data and functionality. The backend will handle these requests, process the data, and interact with the database to fetch or store data and then return the necessary responses. The application will be deployed on an AWS EC2 instance, as it provides good scalability and interactivity with other AWS services, such as our hosted database.

### Security

- **OAuth 2.0**: Enable users to sign in securely using their Gmail address, ensuring proper authentication and access control to sensitive user data.
- **Branca**: Generate and verify tokens for secure communication between the React frontend and Spring Boot backend, ensuring data integrity and preventing unauthorized access. Branca is a lightweight cryptographic authentication token that provides secure and tamper-proof communication between the frontend and backend.

## Project Management

- Daily scrum meetings will take place at 9am, Monday to Friday.
- Progress of the project will be tracked using the Project Board on GitHub and will also be used in the scrum meetings.
- A biweekly (every two weeks) summary report will be submitted to the client and will include information such as obstacles encountered, progress of current work, and planning of future goals.
- Biweekly meetings with our client will take place.
- Biweekly meetings with our lecturer mentor will take place.

## Class Diagram
![Class Diagram](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/ClassDiagram.drawio%20(1).png)

The main element of this class diagram is the user component, designed to deliver a highly efficient and user-friendly experience. The user would have the option to save posts to the local storage of their device and upload it at a later stage, or they can save their posts straight to the database if they have an active internet connection. Posts are made up of a photo, a caption (a short description of the animal in the photo) as well as the location where the photo was taken. The user can have multiple posts. They can belong to multiple groups and groups can have multiple users. The user as well as every group has a map component which displays the location of all the animals in the posts. This creates an easy interface to view the location of the animals.

## The Lookout Project Will

### 1. Provide a Progressive Web App (PWA):

1.1 Ensure compatibility with major mobile operating systems (iOS, Android).

1.2 Provide clear instructions for installation.

1.3 Optimize performance for mobile devices.

1.4 Make the PWA accessible offline:

   1.4.1 Implement local storage for caching posts.
   
   1.4.2 Queue and synchronize data uploads when the device reconnects to the internet.
   
   1.4.3 Provide feedback to users about offline status and pending uploads.

### 2. Enable Gmail Sign-in:

2.1 Implement OAuth authentication with Google.

2.2 Ensure secure transmission and storage of user credentials.

### 3. Enable Users to Post Photos:

3.1 Integrate native camera functionality for capturing photos.

3.2 Use device's location service to fetch and display current location.

3.3 Provide an option to add captions or descriptions to the photos.

### 4. Provide Users with a Map of Points of Interest:

4.1 Aggregate and visualize data on a map.

4.2 Implement filters for different categories (i.e., animal sightings, camping locations, security concerns).

4.3 Provide options for zooming and panning in the map.

### 5. Provide User Groups:

5.1 Implement functionality for creating new groups.

5.2 Enable search functionality to find existing groups.

5.3 Allow users to request to join groups.

5.4 Provide group management features for administrators.

5.5 Enable users to see consolidated maps of all points of interest in the group

  5.5.1 Aggregate and display data from all group members on a single map.
   
  5.5.2 Ensure privacy controls so that only authorized group members can view group data.

## Subsystems

Systems to be implemented:
- User Administration subsystem
- Photo Capture and Geo-tagging Subsystem
- Map and Visualization Subsystem
- Group Management Subsystem
- PWA Functionality Subsystem

## Use Case Diagrams

![Group Management Use Case Diagram](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/GroupManagement.drawio%20(2).png)

![Map and Visualization Subsystem](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/MapAndVisualizationSubsystem.drawio.png)

![PWA Functionality Subsystem](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/PWAFunctionality.drawio.png)

![Photo Capture and Geo-tagging subsystem](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/PhotoCapture.drawio.png)

![User Administration Subsystem](https://github.com/COS301-SE-2024/Lookout/blob/docs/diagrams/User_administration.drawio.png)


## Traceability Matrix

# Traceability Matrix

| R    | User Administration | Photo Capture and Geo-tagging | Map and Visualization | Group Management | PWA Functionality |
|------|---------------------|------------------------------|-----------------------|------------------|-------------------|
| 1.1  |                     |                              |                       |                  | X                 |
| 1.2  |                     |                              |                       |                  | X                 |
| 1.3  |                     |                              |                       |                  | X                 |
| 1.4.1|                     |                              |                       |                  | X                 |
| 1.4.2|                     |                              |                       |                  | X                 |
| 1.4.3|                     |                              |                       |                  | X                 |
| 2.1  | X                   |                              |                       |                  |                   |
| 2.2  | X                   |                              |                       |                  |                   |
| 3.1  |                     | X                            |                       |                  |                   |
| 3.2  |                     | X                            |                       |                  |                   |
| 3.3  |                     | X                            |                       |                  |                   |
| 4.1  |                     |                              | X                     |                  |                   |
| 4.2  |                     |                              | X                     |                  |                   |
| 4.3  |                     |                              | X                     |                  |                   |
| 5.1  |                     |                              |                       | X                |                   |
| 5.2  |                     |                              |                       | X                |                   |
| 5.3  |                     |                              |                       | X                |                   |
| 5.4  |                     |                              |                       | X                |                   |
| 5.5.1|                     |                              |                       | X                |                   |
| 5.5.2|                     |                              |                       | X                |                   |

