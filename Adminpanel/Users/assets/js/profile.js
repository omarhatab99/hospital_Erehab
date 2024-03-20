import { doc, onSnapshot , getFirestore} from "firebase/firestore";
import {updateUserHandle, userValidation } from "./users";
import moment from 'moment';
import { getFormData } from "../../../Shared/Extension";
import { firestore } from "../../../../main";


//constants



let params = new URLSearchParams(location.search);
const id = params.get('id');


const updateUserForm = document.getElementById("updateUserForm");

//handle profile
const profileHandle = () => {


    getCurrentUser();//get current user
    updateProfile();//update user
}


//update profile handle
const updateProfile = () => {

    document.getElementById("updateUserBtn").addEventListener("click" , (event) => {

        event.preventDefault();

        const currentObject = getFormData(updateUserForm);

        //validation
        const validationResult =  userValidation(currentObject , "UPDATE");

        if(validationResult.isValid)
        {

            document.getElementById("updateUserBtn").classList.add("disabled");

            //check translation 
            if(localStorage.getItem("Translate"))
            {
                const language = localStorage.getItem("Translate");
                
                document.getElementById("updateUserBtn").innerHTML = (language == "en")
                    ? `
                        <div class="spinner-border text-secondary me-1" role="status">
                            <span class="visually-hidden">Loading...</span> 
                        </div>
                        Loading...
                      ` 
                    : `
                        تحميل ...
                        <div class="spinner-border text-secondary me-1" role="status">
                            <span class="visually-hidden">Loading...</span> 
                        </div>
                        
                    
                      `;

            }
            else
            {

                //change mode for submit btn for server loading
                document.getElementById("updateUserBtn").innerHTML = 
                `
                    <div class="spinner-border text-secondary me-1" role="status">
                        <span class="visually-hidden">Loading...</span> 
                    </div>
                    Loading...
                `


            }
            
            //update
            updateUserHandle(currentObject , id).then((resolvedData) => {

                if(resolvedData.done)
                {

                    //check translation 
                    if(localStorage.getItem("Translate"))
                    {
                        document.getElementById("updateUserBtn").classList.remove("disabled");

                        const language = localStorage.getItem("Translate");
                        
                        document.getElementById("updateUserBtn").innerHTML = (language == "en")
                         ? "Save Changes" 
                         : "حفظ التغيرات";

                    }
                    else
                    {

                        document.getElementById("updateUserBtn").classList.remove("disabled");

                        //change mode for submit btn for server loading
                        document.getElementById("updateUserBtn").innerHTML = 
                        `
                            Save Changes
                        `

                    }

    

    
                    //empty span error
                    document.getElementById("updateUserValidationSpan").textContent = "";
                }
    
            })
            .catch((rejectedData) => {
                document.getElementById("updateUserBtn").classList.remove("disabled");

                //generate error at span html
                document.getElementById("updateUserValidationSpan").textContent = rejectedData.messageError;
    
                    //check translation 
                    if(localStorage.getItem("Translate"))
                    {
                        const language = localStorage.getItem("Translate");
                        
                        document.getElementById("updateUserBtn").innerHTML = (language == "en")
                         ? "Save Changes" 
                         : "حفظ التغيرات";

                    }
                    else
                    {

                        //change mode for submit btn for server loading
                        document.getElementById("updateUserBtn").innerHTML = 
                        `
                            Save Changes
                        `

                    }
            });

        }
        else
        {
            console.log(validationResult);
            //generate error at span html
            document.getElementById("updateUserValidationSpan").textContent = validationResult.messageError;
            
        }





        


    });

}



//display user data

const getCurrentUser = async() => {

    const documentationReference = doc(firestore , "Users" , id);
    onSnapshot(documentationReference , (snapshot) => {

        if(!snapshot.data())
        {
            window.location.assign("/Adminpanel/Authentication/Login");
        }

        let user = {id: snapshot.id , ...snapshot.data()};

        if(user.profileImage.imageUrl)
        {
            document.querySelector(".card-img img").src = user.profileImage.imageUrl;
        }
        else
        {
            document.querySelector(".card-img img").src = "assets/images/avatar.png";
        }

        document.querySelector(".profile-username").textContent = user.username;

        document.querySelector(".right-username").textContent = user.username;

        document.querySelector(".right-email").textContent = user.email;
        
        if(user.phone)
        {
            document.querySelector(".right-phone").textContent = user.phone;
        }
        else
        {
            document.querySelector(".right-phone").textContent = "xxxxxxxxxxxx";
        }

        document.querySelector(".right-createdAt").textContent = moment(user.createAt).format('MMMM Do YYYY');
        
        if(user.lastUpdatedAt){
            document.querySelector(".right-lastUpdated").textContent = moment(user.lastUpdatedAt).format('MMMM Do YYYY');
        }
        else
        {
            document.querySelector(".right-lastUpdated").textContent = "no update yet";
        }

        document.querySelector(".right-role").textContent = user.role;

        //form
        document.getElementById("username").value = user.username;

        if(user.phone)
        {
            document.getElementById("phone").value = user.phone;
        }

    });

}











profileHandle();