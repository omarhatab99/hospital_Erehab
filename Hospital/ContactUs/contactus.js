//handle contact us

import { createMessageHandler } from "../../Adminpanel/Messages/assets/js/messages";
import { getFormData } from "../../Adminpanel/Shared/Extension";
import { ValidationResult } from "../../Adminpanel/Shared/modules";


//constants
const contactusForm = document.getElementById("contactusForm")
const contactUs = () => {



    createMessage();



}


//create message handle
const createMessage = () => {

    document.getElementById("sendMessage").addEventListener("click" , async(event) => {

        event.preventDefault();

        //Get Data From Form.
        const currentObject = getFormData(contactusForm);
        currentObject.createAt = `${new Date()}`;
        currentObject.lastUpdatedAt = "";
        currentObject.isWatched = false;
        
        //validation 
        const validationResult = contactusValidation(currentObject);

        if(validationResult.isValid)
        {

            //change mode for submit btn for server loading
            document.getElementById("sendMessage").innerHTML = 
            `
                <div class="spinner-border text-light me-1" role="status" style="width:20px; height: 20px;">
                    <span class="visually-hidden">Loading...</span> 
                </div>
                Loading...
            `

            document.getElementById("messageErrorSpan").textContent = "";

            createMessageHandler(currentObject).then((data) => {
                if(data.done)
                {
                     //change mode for submit btn for server loading
                    document.getElementById("sendMessage").innerHTML = 
                    `
                        Send
                    `
                    contactusForm.reset();
                }

            })
            .catch((data) => {
                document.getElementById("messageErrorSpan").textContent = data.messageError;
            })
        }
        else
        {
            document.getElementById("messageErrorSpan").textContent = validationResult.messageError;
        }

    });


}

//handle contact us validation
const contactusValidation = (currentObject) => {
    const validationResult = new ValidationResult();
    validationResult.isValid = false;

    //regex
    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi);
    const emailValid = emailRegex.test(currentObject.email);
    
    if(!currentObject.username)
    {
        validationResult.messageError = "Name field must be required ..!!";
        validationResult.isValid = false;
    }
    else if(currentObject.username.length > 50) 
    {
        validationResult.messageError = "Name field must be less than 50 character ..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.email)
    {
        validationResult.messageError = "Email field must be required ..!!";
        validationResult.isValid = false;
    }
    else if(!emailValid)
    {
        validationResult.messageError = "Email invalid..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.message)
    {
        validationResult.messageError = "Message field must be required ..!!";
        validationResult.isValid = false;
    }
    else if(currentObject.message.length < 20)
    {
        validationResult.messageError = "Message field must be more than 20 character ..!!";
        validationResult.isValid = false;
    }
    else
    {
        validationResult.isValid = true;
    }

    return validationResult;


}



contactUs();