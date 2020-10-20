import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
//    console.log(userObj);

    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        dbService.collection("nweets").onSnapshot(snapshot =>{
            let tempNweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                 ...doc.data(),
            }));
            const nweetArray = tempNweetArray.sort((a,b) => {
                return b.createAt - a.createAt
            })
            setNweets(nweetArray);
        });

    }, []);

    
return (
    <div className="container">
        <NweetFactory userObj={userObj}/>
        <div style={{ marginTop: 30 }}>
            {nweets.map((nweet) => (
                <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} userObj={userObj}/>
            ))}
        </div>
    </div>
)};
export default Home;
