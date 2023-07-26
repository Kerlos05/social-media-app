

Welcome to the Social Media App! This application allows users to connect and share their thoughts with others in a social media environment. Below are the steps to get started with the app:



git clone <repository_url>
cd client
npm install


cd ../server
npm install


Inside the server directory, create a .env file with the following content:

DATABASE_URI=<your_database_uri>
PORT=8080




Running the App



cd ../client
npm run start


cd ../server
nodemon server

The client-side will run on http://localhost:3000 and the server will run on http://localhost:8080.



If you encounter any issues or have any feedback, feel free to contact me or open an issue on my GitHub repository.

Happy socializing! 😊
