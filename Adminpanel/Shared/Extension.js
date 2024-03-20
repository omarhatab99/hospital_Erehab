import {deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { app } from "../../main";

//Get From Data
export const getFormData = (htmlForm) => {
    const formData = new FormData(htmlForm);
    const formDataArr = [...formData];
    const currentObject = new Object();
    formDataArr.forEach((element) => {
        currentObject[element[0]] = element[1];
    });

    return currentObject;
}


export const uploadImage = (image , path) => {
    return new Promise((resolve , reject) => {

        const randomImgName = `${randomName()}-${image.name}`;

        const firebaseStoreage = getStorage(app);
        const storgeReference = ref(firebaseStoreage , `${path}/${randomImgName}`);

        const metadata = {contentType : image.type};

        const uploadTask = uploadBytesResumable(storgeReference , image , metadata);
        uploadTask.then((snapshot) => {

            getDownloadURL(storgeReference).then((url) => {

                resolve({imageUrl: url , fullPath: snapshot.metadata.fullPath});

            })
            .catch((error) => {
                reject(error);
            })


        })
        .catch((error) => {
            reject(error);
        })


    });
}


export const deleteImage = (fullPath) => {
    const firebaseStorage = getStorage(app);
    const storgeReference = ref(firebaseStorage , fullPath);
    deleteObject(storgeReference).then(() => {console.log("image deleted")})
    .catch((err) => {console.log(err)})
}


export const generateAccessToken = () => {
    const accessTokenArray = [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ,"A" , "B" , "C" , "D" , "E" , "F" , "G" , "H" , "I" , "J" 
    , "K" , "a" , "b" , "c" , "d" , "e" , "f" , "g" ,"h" , "i" , "j" , "k" 
    , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 ]

    let accessToken = "";

    for(var i = 0; i <= accessTokenArray.length; i++)
    {
        accessToken += accessTokenArray[Math.floor(Math.random() * accessTokenArray.length)]; 
    }

    return accessToken;
}

const randomName = () => {
    const numbers = [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ];

    let randomNameImg = "";

    for(var i = 0; i <= numbers.length; i++)
    {
        randomNameImg += numbers[Math.floor(Math.random() * numbers.length)]; 
    }

    return randomNameImg;
}