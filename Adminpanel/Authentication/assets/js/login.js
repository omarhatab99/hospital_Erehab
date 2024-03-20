
//imports
import {authenticationValidation } from "./authentication"
import {collection , onSnapshot, addDoc, updateDoc, doc ,} from "firebase/firestore";
import { generateAccessToken, getFormData } from "../../../Shared/Extension";
import { getAllUserOnlyTime } from "../../../Users/assets/js/users";
import { firestore } from "../../../../main";
//constants firbase

const collectionReference = collection(firestore , "Users");

//constants application
const loginForm = document.getElementById("loginForm");


//handle login 
const loginHandle = () => {

    //remove access token from local Stroge
    localStorage.removeItem("Hospital_AccessToken");



    seedingAdmin(); //check if application not have any admin
    login(); //login
}


//check if admin email not created
const seedingAdmin = async() => {

    onSnapshot(collectionReference , (snapshot) => {

        if(snapshot.empty){ //if i not have any user

            //get Access Token
            const accessToken = generateAccessToken();

            //create admin email
            try
            {

                const user = new Object();

                user.username = "adminHospital";
                user.email = "adminHospital@gmail.com";
                user.password = "hospital123456";
                user.createAt = `${new Date()}`;
                user.lastUpdatedAt = "";
                user.profileImage = {imageUrl: "" , fullPath:""};
                user.status = true;
                user.role = "ADMIN";
                user.accessToken = accessToken;
                

                addDoc(collectionReference , user).then(() => {

                    console.log("Login");

                })
                .catch((data) => {
                    console.log(data);
                })


            }
            catch(error)
            {
                console.log(error);
            }

        }

    });

}

//handle login authentication
const login = () => {

    document.getElementById("loginBtn").addEventListener("click" , async(event) => {

        event.preventDefault();

        //Get Form Data --1
        const currentObject = getFormData(loginForm);

        //validation
        const validationResult = authenticationValidation(currentObject);

        //check validation
        if(validationResult.isValid)
        {
            //is valid

            //change mode for submit btn for server loading
            document.getElementById("loginBtn").innerHTML = 
            `
                <div class="spinner-border text-light me-1" role="status" style="width:20px; height: 20px;">
                    <span class="visually-hidden">Loading...</span> 
                </div>
                Loading...
            `

            const users = await getAllUserOnlyTime();

            //check if account is already in database
            const accountLogin = users.find((account) => {
                return (account.email === currentObject.email) && (account.password === currentObject.password)
            });

            if(accountLogin)
            {
                //empty error span
                document.getElementById("errorSpan").textContent = "";


                try{

                    //update access token before login

                    const documentationReference = doc(firestore , "Users" , accountLogin.id);

                    const newAccessToken = generateAccessToken();

                    const user = {accessToken: newAccessToken};

                    updateDoc(documentationReference , user).then(() => {
                        //set access token to local storage.
                        localStorage.setItem('Hospital_AccessToken' , newAccessToken);

                        //send user to dashboard
                        window.location.assign(`/Adminpanel/Dashboard/Home.html`);

                        //change mode for submit btn for server loading
                        document.getElementById("loginBtn").innerHTML = 
                        `
                            Login
                        `
                        
                    })
                    .catch((error) => {
                        
                        //change mode for submit btn for server loading
                        document.getElementById("loginBtn").innerHTML = 
                        `
                            Login
                        `

                        document.getElementById("errorSpan").textContent = error;
                        
                    })

                }
                catch(error)
                {
                    //change mode for submit btn for server loading
                    document.getElementById("loginBtn").innerHTML = 
                    `
                        Login
                    `

                    document.getElementById("errorSpan").textContent = error;
                }
            }
            else
            {
                //change mode for submit btn for server loading
                document.getElementById("loginBtn").innerHTML = 
                `
                    Login
                `

                document.getElementById("errorSpan").textContent = "Email or Password may be incorrect..!!";
            }
        }
        else
        {
            //not valid
            document.getElementById("errorSpan").textContent = validationResult.messageError;  
        }

    });
}

loginHandle();

