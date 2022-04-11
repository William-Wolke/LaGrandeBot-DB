export const InsertOne = async (collection, object) => {
    let response = false
    await collection.insertOne(object)
    .then(result => response = true)
    .catch(error => {
        console.error(error);
        response = false;
    });
    return response;
}