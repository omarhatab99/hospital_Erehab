//exports
import { generateAccessToken} from "../../../Shared/Extension";
import { ValidationResult} from "../../../Shared/modules";
import {getAuth} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {app, firestore} from "../../../../main";

//constants
const authentication = getAuth(app)

//authentication validation.
export const authenticationValidation = (currentObject) => {

    const validationResult = new ValidationResult();

    if(!currentObject.email)
    {
        validationResult.messageError = "Email field must be required..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.password)
    {
        validationResult.messageError = "Password field must be required..!!";
        validationResult.isValid = false;
    }
    else
    {
        validationResult.isValid = true;
    }

    //check if validation is valid
    return validationResult;
}

//authentication logout
export const authenticationLogout = (id) => {

    //update access token before logout

    const documentationReference = doc(firestore , "Users" , id)

    const newAccessToken = generateAccessToken();

    const user = {accessToken: newAccessToken};

    try {

        updateDoc(documentationReference , user).then(() => {
            //remove access token from local storage.
            localStorage.removeItem('Hospital_AccessToken');
            window.location.assign("/Adminpanel/Authentication/Login.html");
        })
        .catch((error) => {
            
            console.log(error);

        })


    }
    catch(error)
    {
        console.log(error);
    }


}

