//imports
import { collection  , where , query , getDocs, doc, getDoc, updateDoc, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { Result, ValidationResult } from "../../../Shared/modules";
import { deleteImage, uploadImage } from "../../../Shared/Extension";
import { firestore } from "../../../../main";

//constants
const collectionReference = collection(firestore , "Users");


export const createUserHandle = (currentObject) => {

    return new Promise((resolve , reject) => {

        try{
            //get Data from form 
            addDoc(collectionReference , currentObject).then((data) => {
                const userResult = new Result();
                userResult.done = true;
                userResult.result = data;

                resolve(userResult);

            })
            .catch((data) => {
                const userResult = new Result();
                userResult.done = false;
                userResult.messageError = data;

                reject(userResult);
            })

        }
        catch(error)
        {

            const userResult = new Result();
            userResult.done = false;
            userResult.messageError = error;

            reject(userResult);

        }


    });


}


//handle user update
export const updateUserHandle = (currentObject , id) => {

    return new Promise(async(resolve , reject) => {

        const oldUser = await getUserById(id);
        const documentationReference = doc(firestore , "Users" , id);


        try {
            //check if admin send photo 
            if(currentObject.profileImage.name) 
            {
                if(oldUser.profileImage.fullPath)
                {
                    deleteImage(oldUser.profileImage.fullPath);
                }

                currentObject.profileImage = await uploadImage(currentObject.profileImage , "Users");
            }
            else
            {
                currentObject.profileImage = oldUser.profileImage;
            }
            //upload data
            currentObject.lastUpdatedAt = `${new Date()}`;
            updateDoc(documentationReference , currentObject).then(() => {
                const result = new Result();
                result.done = true;

                resolve(result);
            })
            .catch((error) => {

                const result = new Result();
                result.messageError = error;
                result.done = false;
    
                reject(result);

            })
        }
        catch(error)
        {
            const result = new Result();
            result.messageError = error;
            result.done = false;

            reject(result);
        }

    });

}

//get all user to display it in datatable
export const getAllUser = () => {

    //get all user
    const collectionReference = collection(firestore , "Users");
    onSnapshot(collectionReference , (snapshot) => {


        const users = [];

        snapshot.docs.forEach((doc) => {

            users.push({id: doc.id , ...doc.data()});

        });


        generateUsersDatatable(users) //generate datatable


    });


}

const generateUsersDatatable = (users) => {

    if(document.getElementById("usersDataContainer"))
    {
        document.getElementById("usersDataContainer").innerHTML = "";


        $(".datatables-users-basic").DataTable().clear().draw();
    
    
        users.forEach((user) => {
    
            $(".datatables-users-basic").DataTable().row.add(user).draw();
    
        });
    }



}



//get user by id
export const getUserById = (id) => {

    return new Promise((resolve , reject) => {

        const documentationReference = doc(firestore , "Users" , id);

        let user = new Object();
    
        getDoc(documentationReference).then((snapshot) => {
    
            
            user = {id: snapshot.id , ...snapshot.data()};

    
            resolve(user);
    
        })
        .catch((rejectedData) => {
            reject(rejectedData);
        })

    });


}

//get user by access token
export const getUserByAccessToken = (accessToken) => {

    return new Promise(async(resolve , reject) => {

        const users = await getAllUserOnlyTime();

        const accountLogin = users.find((element) => {return element.accessToken == accessToken});

        if(accountLogin)
        {   
            resolve(accountLogin);
        }
        else
        {
            reject("This user not found..!!");
        }
    });


}

//get All user only one time
export const getAllUserOnlyTime = async() => {

    return new Promise(async(resolve , reject) => {


        //get all user
        const collectionReference = collection(firestore , "Users");

        const w = where("status", "==", true);
        const q = query(collectionReference , w);

        let counter = 0;
        const currentUsers = [];

        getDocs(q).then((docs) => {
            docs.forEach((doc) => {
                counter++;
                currentUsers.push({id:doc.id , ...doc.data()});
                if(counter >= docs.size)
                {
                    resolve(currentUsers);
                }
            });
            
        })
        .catch((data) => {
            reject(data);
        });

    })



}

//delete user by id
export const deleteUserHandle = async(id) => {

    try{

        const documentationReference = doc(firestore , "Users" , id);

        const user = await getUserById(id);
        const fullPath = user.profileImage.fullPath;
        //check if user has image
        deleteDoc(documentationReference).then(() => {

            //check if user has image
            if(fullPath)
            {
                deleteImage(fullPath);
            }

        })
        .catch((data) => {
            console.log(data);
        })


    }
    catch(error)
    {
        console.log(error)
    }

}

//user validation
export const userValidation = (currentObject , operation) => {

    const validationResult = new ValidationResult();
    
    const phoneRegex = new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/g);

    const phonValid = phoneRegex.test(currentObject.phone);

    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi);

    const emailValid = emailRegex.test(currentObject.email);

    if(!currentObject.username && operation == "UPDATE") {

        validationResult.messageError = "Username field must be required..!!";
        validationResult.isValid = false;
    }
    else if(currentObject.username?.length > 50 && operation == "UPDATE")
    {
        validationResult.messageError = "Username field must be less than 50 character..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.email && operation == "CREATE")
    {
        validationResult.messageError = "Email field must be required..!!";
        validationResult.isValid = false;
    }
    else if(!emailValid && operation == "CREATE")
    {
        validationResult.messageError = "Email invalid..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.password && operation == "CREATE")
    {
        validationResult.messageError = "Password field must be required..!!";
        validationResult.isValid = false;
    }
    else if(currentObject.password < 6 && operation == "CREATE")
    {
        validationResult.messageError = "Password field must more than or equal 6 ..!!";
        validationResult.isValid = false;
    }
    else if(!currentObject.role && operation == "CREATE")
    {
        validationResult.messageError = "Role field must be required..!!";
        validationResult.isValid = false;
    }
    else if((!phonValid || currentObject.phone.length > 11) && operation == "UPDATE")
    {
        validationResult.messageError = "Phone invalid..!!";
        validationResult.isValid = false;
    }
    else
    {
        validationResult.isValid = true;
    }


    return validationResult;

}


