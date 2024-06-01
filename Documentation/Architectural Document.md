# Lookout
## Architectural Document
### Design Patterns
1. #### Composite
The Composite design pattern allows you to compose objects into tree structures to
represent part-whole hierarchies. It lets clients treat individual objects and
compositions of objects uniformly. We use it to represent the group object where
multiple users can belong to the same group.

![Composite](./diagrams/Composite.png)

2. #### Strategy
Defining a family of algorithms, encapsulating each one, and making them interchangeable. 
This is useful for implementing different search or filter strategies for points of interest.

![Strategy](./diagrams/Strategy.png)

### Quality Attributes
1. #### Security<br/>
   Security is a critical requirement for Lookout as it deals with sensitive user data, including location information and photos. Ensuring that this data is securely stored and transmitted is vital to protect users from privacy breaches and potential misuse of their personal information. The use of Google OAuth for secure login adds an extra layer of security by leveraging Google’s robust authentication mechanisms. This protects user accounts from unauthorised access and ensures that data remains secure during the login process.
2. #### Availability<br/>
Lookout must be available offline to accommodate users in remote areas with poor or intermittent internet connectivity. Offline functionality is essential for users who are often in areas with limited network coverage, such as hiking trails or remote camping sites. Ensuring the app works offline means users can still capture and save data locally, which will be synced once a connection is re-established. This functionality is crucial for maintaining user engagement and ensuring the app is useful in real-world scenarios where internet access may be unpredictable.  
3. #### Usability<br/>
The application must be user-friendly and accessible to users of all ages. Given the target audience, which includes avid bird-watchers, hikers, and nature enthusiasts, the interface should be intuitive and easy to navigate. High usability ensures that users can efficiently interact with the application, post photos, join groups, and view maps without unnecessary complications. By reducing the learning curve, the app enhances user satisfaction and encourages more frequent use.  
4. #### Scalability/Performance<br/>
Efficient image loading and data handling are critical for the scalability and performance of Lookout. As the user base grows and the volume of photos increases, the app must be able to handle large amounts of image data quickly and efficiently. Scalability ensures that the app can accommodate an increasing number of users and a growing dataset without degrading performance. This is essential for maintaining a smooth user experience and ensuring that the app remains responsive and fast.
5. #### Reliability<br/>
Reliability is essential for building user trust in Lookout. The application must consistently perform its functions accurately, from posting photos to updating real-time location data. Reliability also involves ensuring that data is not lost and that offline posts are correctly synced once online. A reliable app ensures users can depend on it for accurate and timely information, especially in critical scenarios such as tracking animal sightings or reporting security concerns.

### Architectural Patterns
1. #### Services Oriented
SOA was chosen for its ability to divide the system into independent services, each responsible for a specific function, which communicates over a network. This pattern enables separate services for authentication, posts, groups, maps etc. SOA enhances flexibility, allowing service reuse across different applications, and offers high scalability as services can be independently scaled based on demand. Its independent service nature ensures high reliability and resilience with robust failover and redundancy mechanisms.

2. #### Layered
Layered architecture organises the system into layers with specific responsibilities like presentation, business logic, and data access. Usage in the system would include
- Presentation Layer: PWA frontend, API Gateway.
- Business Logic Layer: Core services.
- Data Access Layer: Database and storage
Layered was chosen because of its independant scalability and good performance under heavy load because each layer can be scaled independently based on demand. We also decided on Layered pattern because of its security because the layers can implement distinct security measures.

3. #### MVC
The MVC (Model-View-Controller) architectural pattern is essential for designing and organising code in a maintainable and scalable manner. This pattern divides the application into three interconnected components, which helps separate the internal representations of information from the ways that information is presented and accepted by the user.
- Model
  - Represents the data and business logic of the application.
  - Handles data access and includes reusable business services.
  - Interacts with the database to fetch and store data, providing it to the Controller and View as needed.
- View
  - Acts as the presentation layer, displaying data to the user in a specific format.
  - Receives data from the Model and sends user inputs to the Controller.
- Controller
  - Intermediary between the View and the Model, processing user inputs.
  - Manages the flow of data, updating the Model or View as necessary.
  - Handles user interactions such as creating geo-tagged points, managing authentication, and coordinating with the Model for data operations.
MVC was chosen for its responsive design due to the dedicated View component and was also chosen because it is simple to implement and maintain and is very scalable.

## Constraints
### Architectural Constraints
- The application must be implemented as a Progressive Web App (PWA) to ensure cross-platform compatibility and ease of access on both desktop and mobile devices.
- The use of a web framework is mandatory, and the solution must be deliverable to mobile devices using PWA technologies.
- The system architecture must support offline functionality, allowing the application to store data locally and synchronise with the server when an internet connection is available.
- The application must use Google OAuth for user authentication to ensure secure and reliable login functionality.
- The solution must be hosted on cloud platforms such as AWS, Azure, or GCP to leverage scalable and reliable infrastructure services.

### Technology Constraints
- Frontend: The application frontend must be developed using React to ensure a modern, responsive user interface.
- Backend: The backend must be developed using Spring Boot with Kotlin to leverage a robust and scalable server-side framework.
- Database: The application must use PostgreSQL (latest stable version) for reliable and scalable data storage.
- Deployment: The solution must be deployable on cloud platforms like AWS, Azure, or GCP to ensure high availability and scalability.

### Performance Constraints
- The architecture must support efficient image loading and handling to ensure smooth performance, even with a large volume of image data.
- The solution should aim to load all pages within a 1-second timeframe to provide a responsive user experience.

### Availability Constraints
- The system must support offline functionality, enabling users to capture and save data locally and synchronise it with the server when online.
- Cloud hosting on platforms like AWS, Azure, or GCP ensures high availability and reliability, leveraging the infrastructure's built-in redundancy and failover mechanisms.
- The application should be designed to handle increased loads without sacrificing availability, utilising scalable cloud resources to accommodate growing user demand.

## Architecture Diagram
![Arc Doc](./diagrams/ArchitectureDiagram.png)
