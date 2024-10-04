import './App.css';
import { React, useEffect, useState  } from 'react'
import { BrowserRouter,Router,Routes, Route,useLocation } from 'react-router-dom'
import { AuthContextProvider } from './auth';
import { GlobalStoreContextProvider } from './store'
import{
	AppBanner,
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    PasswordRecovery,
    MapCreationPage,
    MapDetailScreen,
    MyMapScreen,
    MyInfoScreen,
    MessageCenter,
    MapEdit,
    MapEditHeat,
    MapEditPoint,
    RegionalEdit,
    MainPage,
    MapInfoEditPage,
    PathEdit
} from './components'
import IconBanner from './components/IconBanner';
  const App = () => {
    return (
      <BrowserRouter>
        <AuthContextProvider>
          <GlobalStoreContextProvider>
            <IconBanner />
            <AppWithDynamicBanner />
          </GlobalStoreContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    );
  };
  
  const AppWithDynamicBanner = () => {
    const location = useLocation();
    const showAppBanner = ['/Home','/home', '/create',"/detail","/profile","/profile/my-maps"
    ,"/profile/message-center","/profile/personal-information"
    ,"/edit","/edit-heat","/regional-edit","/search", '/'];
    const notShowAppBanner = ['/login','/register','/forgot','/sign-out','/Login'];
    console.log(location.pathname);
    const shouldShowAppBanner = !notShowAppBanner.includes(location.pathname);
  
    return (
      <>
        {shouldShowAppBanner && <AppBanner />}
        <Routes>
            <Route index element={<HomeScreen />} />
            <Route path="/main" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/create" element={<MapCreationPage />} />
            <Route path="/detail/:id" element={<MapDetailScreen />} />
            <Route path="/profile" element={<MyInfoScreen />} />
            <Route path="/profile/my-maps" element={<MyMapScreen />} />
            <Route path="/profile/personal-information" element ={<MyInfoScreen />} />
            <Route path="/profile/message-center" element ={<MessageCenter />} />
            <Route path="/edit/:id" element ={<MapEdit />} />
            <Route path="/forgot" element={<PasswordRecovery />} />
            <Route path="/sign-out" element={<LoginScreen />} />
            <Route path="/edit-heat/:id" element={<MapEditHeat />} />
            <Route path="/point-edit/:id" element={<MapEditPoint />} />
            <Route path="/regional-edit/:id" element={<RegionalEdit />} />
            <Route path="/search" element={<HomeScreen />} />
            <Route path="/map-info-edit/:id" element={<MapInfoEditPage />} />
            <Route path="/path-edit/:id" element={<PathEdit/>} />
        </Routes>
      </>
    );
  };
  
  export default App;
// const App = () => {  
//     const location = useLocation();
//   const showAppBanner = ['/home', '/create'];

//   const [shouldShowAppBanner, setShouldShowAppBanner] = useState(showAppBanner.includes(location.pathname));

//   useEffect(() => {
//     setShouldShowAppBanner(showAppBanner.includes(location.pathname));
//   }, [location]);
//     return (
//         <BrowserRouter>
//             <AuthContextProvider>
//                 <GlobalStoreContextProvider> 
//                     <IconBanner/>           
//                     {showAppBanner.includes(window.location.pathname) && <AppBanner />}
// 						{/* <Router> */}
// 							<Routes>
                            
//                                 <Route path="/main" element={<MainPage />} />
// 								<Route path="/login" element={<LoginScreen />} />
// 								<Route path="/register" element={<RegisterScreen />} />
//                                 <Route path="/home" element={<HomeScreen />} />
//                                 <Route path="/create" element={<MapCreationPage />} />
//                                 <Route path="/detail" element={<MapDetailScreen mapDetails={sampleMapDetails["1"]} />} />
//                                 <Route path="/profile" element={<MyInfoScreen />} />
//                                 <Route path="/profile/my-maps" element={<MyMapScreen />} />
//                                 <Route path="/profile/personal-information" element ={<MyInfoScreen />} />
//                                 <Route path="/profile/message-center" element ={<MessageCenter />} />
//                                 <Route path="/edit" element ={<MapEdit />} />
//                                 <Route path="/forgot" element={<PasswordRecovery />} />
//                                 <Route path="/sign-out" element={<LoginScreen />} />
//                                 <Route path="/edit-heat" element={<MapEditHeat />} />
//                                 <Route path="/regional-edit" element={<RegionalEdit />} />
// 							</Routes>
// 						{/* </Router> */}
//                 </GlobalStoreContextProvider>
//             </AuthContextProvider>
//         </BrowserRouter>
//     )
// }

// export default App



// import React, {useState, useEffect} from 'react'
// import axios from 'axios';



// const App = function () {
// 	const [users, setUsers] = useState([]);

// 	const [username, setUsername] = useState("");
// 	const [email, setEmail] = useState("");
// 	useEffect(() => {
// 		axios
// 			.get("https://blankmap-server-6de6d45e4291.herokuapp.com/api/users")
// 			.then((users) => setUsers(users.data))
// 			.catch((err) => console.log(err));
// 	}, []);

// 	function submitForm(event) {
//     event.preventDefault();
// 		if (username === "") {
// 			alert("Please fill the username field");
// 			return;
// 		}
// 		if (email === "") {
// 			alert("Please fill the email field");
// 			return;
// 		}
//     // https://blankmap-server-6de6d45e4291.herokuapp.com:5000/api/users // http://localhost:8000/api/users
// 		axios
// 			.post("https://blankmap-server-6de6d45e4291.herokuapp.com/api/users", {
// 				name: username,
// 				email: email,
// 			})
// 			.then(function () {
// 				alert("Account created successfully");
//         window.location.reload();
// 				// window.location.reload();
// 			})
// 			.catch(function () {
// 				alert("Could not creat account. Please try again");
// 			});
// 	}
// 	return (
// 		<>
// 			<h1>My Project</h1>
// 			{users === null ? (
// 				<p>Loading...</p>
// 			) : users.length === 0 ? (
// 				<p>No user available</p>
// 			) : (
// 				<>
// 					<h2>Available Users</h2>
// 					<ol>
// 						{users.map((user, index) => (
// 							<li key={index}>
// 								Name: {user.name} - Email: {user.email}
// 							</li>
// 						))}
// 					</ol>
// 				</>
// 			)}

// 			<form onSubmit={submitForm}>
// 				<input
// 					onChange={(e) => setUsername(e.target.value)}
// 					type="text"
// 					placeholder="Enter your username"
// 				/>
// 				<input
// 					onChange={(e) => setEmail(e.target.value)}
// 					type="text"
// 					placeholder="Enter your email address"
// 				/>
// 				<input type="submit" />
// 			</form>
// 		</>
// 	);
// };
// export default App
