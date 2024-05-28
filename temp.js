
    const dummyDB = async () => {
        try {
            await setDoc(doc(db, "user2", "chicken rice"), initData);
        } catch (error) {
            console.log('Error', error)
        }
    }


    //verify if this item is already in the menu
    const dummyVerify = async () => {
        const dummy = collection(db, "user1");
        try {
            const querySnapshot = await getDocs(dummy);
            if (querySnapshot.empty) {
                console.log("empty");
            } else {
                console.log('Not empty');
            }
        } catch (error) {
            console.log('error');
        }
    }

    const dummyAdd = async () => {
        try {
            await setDoc(doc(db, "user1", "other chicken rice"), initData2);
        } catch (error) {
            console.log('Error', error)
        }
    }

    //finding out current user's profile
    const findCurrUser = () => {
        let user = auth.currentUser;
        console.log(user.email);
    }

        const initData = {
        price: 10,
        description: "hainanese chicken rice..."
    }

    const initData2 = {
        price: 5,
        description: "cantonese chicken rice..."
    }

