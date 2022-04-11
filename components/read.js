export const FindDuplicateName = async (collection, name) => {
    await collection.find({"name": name}).toArray()
    .then((result) => {
        if (!result) {
            return false;
        }
        else {
            return true;
        }
    })
    .catch((error) => {
        return error;
    });
}

export const FindName = async (collection, name) => {
    let response = {success: false, person: {}, error: {}};
    await collection.find({"name": name}).toArray()
    .then((result) => {
        if (result) {
            response.success = true;
            response.person = result;
        }
        else {
            response.success = false;
        }
    })
    .catch((error) => {
        console.error(error);
        response.success = false;
        response.error = error;
    });
    return response;
}

export const FindAll = async (collection) => {
    let returnThing = false;
    
    await collection.find({}).toArray()
    .then((result) => {
        returnThing = result;
    })            
    .catch(error => {
        console.error(error);
        returnThing = false;
    })
    return returnThing;

}