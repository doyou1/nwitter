import { dbService, storageService } from "fbase";
import {v4 as uuid4} from "uuid";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({userObj, nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const [newAttachment, setNewAttachment] = useState();

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if(ok){
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    }
    
    const toggleEditing = () => (
        setEditing((prev) => !prev)
    );

   
    const onSubmit = async (event) => {
        event.preventDefault();
        let newNweetObj = {
            text : newNweet,
        };
        let newAttachmentUrl = "";
        if(newAttachment != ""){
            const newAttachmentRef = storageService.ref().child(`${userObj.uid}/${uuid4()}`);
            const response = await newAttachmentRef.putString(newAttachment, "data_url");
            newAttachmentUrl = await response.ref.getDownloadURL();
            newNweetObj = {
                text : newNweet,
                attachmentUrl : newAttachmentUrl,
            };
            if(nweetObj.attachmentUrl != ""){
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
            }

        }

        await dbService.doc(`nweets/${nweetObj.id}`).update(newNweetObj);
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target : {value},
        } = event;
        setNewNweet(value);
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
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };
    return (
    
    <div className="nweet">
        {editing ? (
            <>
            {isOwner && (
                <>
                <form onSubmit={onSubmit} className="container nweetEdit">
                    <input type="text" 
                    placeholder="Edit your nweet"
                    value={newNweet}
                    onChange={onChange} 
                    required 
                    autoFocus
                    className="formInput"
                    />
                    {nweetObj.attachmentUrl ?(
                        <>
                        <img src={newAttachment ? newAttachment : nweetObj.attachmentUrl} width="300px" height="300px"/>
                        </>
                    ) : (
                        newAttachment && (
                            <>
                        <img src={newAttachment} width="300px" height="300px"/>
                            </>
                        )
                    )}
                    <input onChange={onFileChange} type="file" accept="image/*" />
                    <input type="submit" value="Update Nweet" className="formBtn"/>
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
                </span>
                </>
            )}
            </>
        ) : (
            <>
            <h4>{nweetObj.text}</h4>
            {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
            { isOwner && (
                <div class="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
            </>
        )}
    </div>
    );
};

export default Nweet;