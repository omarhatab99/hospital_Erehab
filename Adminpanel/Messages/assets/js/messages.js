import { addDoc, collection, doc, getDoc, onSnapshot } from "firebase/firestore"
import { Result } from "../../../Shared/modules";
import {firestore } from "../../../../main";

//constants

const collectionReference = collection( firestore , "Messages");

//create message handler
export const createMessageHandler = (currentObject) => {

    return new Promise((resolve , reject) => {

        try{

            addDoc(collectionReference , currentObject).then((data) => {
    
                const contactusResult = new Result();
                contactusResult.done = true;
                contactusResult.result = data;

                resolve(contactusResult);
    
            })
            .catch((data) => {
    
                const contactusResult = new Result();
                contactusResult.done = false;
                contactusResult.messageError = data;

                reject(contactusResult);

            })
    
        }
        catch(error){
            
            const contactusResult = new Result();
            contactusResult.done = false;
            contactusResult.messageError = error;

            reject(contactusResult);
            
        }

    })

    


}


//get all user to display it in datatable
export const getAllMessages = () => {

    //get all user
    onSnapshot(collectionReference , (snapshot) => {


        const messages = [];

        snapshot.docs.forEach((doc) => {

            messages.push({id: doc.id , ...doc.data()});

        });


        generateMessagesDatatable(messages) //generate datatable


    });


}

const generateMessagesDatatable = (messages) => {

    if(document.getElementById("messagesDataContainer"))
    {
        document.getElementById("messagesDataContainer").innerHTML = "";


        $(".datatables-messages-basic").DataTable().clear().draw();
    
    
        messages.forEach((message) => {
    
            $(".datatables-messages-basic").DataTable().row.add(message).draw();
    
        });
    }



}


//get message by id
export const getMessageById = (id) => {

    return new Promise((resolve , reject) => {

        const documentationReference = doc(firestore , "Messages" , id);

        let message = new Object();
    
        getDoc(documentationReference).then((snapshot) => {
    
            
            message = {id: snapshot.id , ...snapshot.data()};

    
            resolve(message);
    
        })
        .catch((rejectedData) => {
            reject(rejectedData);
        })

    });


}
