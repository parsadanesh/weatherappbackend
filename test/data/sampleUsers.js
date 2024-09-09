const testData = {
    testUsers: [
        {            
            "_id":  "66647b7a661393618c0a0651",
            "email": "test-email1@domain.com",
            "password": "testpass2",
            "savedLocations": [
                "London",
                "Barcelona"],

        },
        {            
            "_id": "66647b7a771393618c0a06a8",
            "email": "test-email2@domain.com",
            "password": "testpass2",
            "savedLocations": [],

        },
        {            
            "_id": "66647b7a661377618c0a06a4",
            "email": "test-email3@domain.com",
            "password": "testpass3",
            "savedLocations": [],

        },
    ],
    newUser: {
        email: "test-email@domain.com",
        password: "testpass1",
    },
    invalidEmail: {
        email: null,
        password: "testpass1",
    },
    invalidPassword: {
        email: "test-email@domain.com",
        password: null,
    },
    invalidUser3: {
        email: "test-email@domain.com",
        password: "testpass1",
    },
}

export default testData;