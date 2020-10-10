import React, { useEffect, useState } from "react";
import {v4 as uuid4} from "uuid";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
//    console.log(userObj);
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    useEffect(() => {
        dbService.collection("nweets").onSnapshot(snapshot =>{
            const nweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                 ...doc.data(),
            }));
            setNweets(nweetArray);
        });

    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        console.log(attachment);
        if(attachment != ""){
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();                
        }
        const nweetObj = {
            text : nweet,
            createAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl,
        }
        console.log(nweetObj);
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");

    };
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {

        const {
            target : {files},
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget : {result}
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);

return (
    <div>
        <form onSubmit={onSubmit}>
            <input 
            value={nweet}
            onChange={onChange}
            type="text" 
            placeholder="What's on your mind?" 
            maxLength={120} />
            <input onChange={onFileChange} type="file" accept="image/*" />
            <input type="submit" value="Nweet" />
                {attachment && 
                <div>
                    <img src={attachment} width="300px" height="300px" />
                    <button onClick={onClearAttachment}>Cancel upload</button>
                </div>}

        </form>
        <div>
            {nweets.map((nweet) => (
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>
            ))}
        </div>
    </div>
)};
export default Home;
