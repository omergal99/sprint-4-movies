import HttpService from './HttpService';

const USER_URL = HttpService.getUrl('user');

const resolveData = res => res.data;

export default {
    singup,
    getGuestUser,
    getById,
    login,
    addFollowUser,
    getLoggedInUser,
    logout
}

const USER_STORAGE = 'user connected';
var loggedInUser = JSON.parse(localStorage.getItem(USER_STORAGE))

function getLoggedInUser() {
    return loggedInUser;
}

function getById(userId) {
    //console.log('i am heer')
    return HttpService.get(`${USER_URL}/${userId}`)
        .then(resolveData)
}


function logout() {
    return HttpService.get(`${USER_URL}/logout`)
        .then(res => {
            console.log('Loged out success');
            console.log('RES IS ', res);
            localStorage.removeItem(USER_ON)
            loggedInUser = null
        })
}

function singup(newUser) {
    console.log('signup', newUser)
    // return new Promise((resolve, reject) => {
    return HttpService.post(`${USER_URL}/singup`, newUser)
        .then(res => {
            loggedInUser = res.data;
            localStorage.setItem(USER_STORAGE, JSON.stringify(loggedInUser));
            let newUser = res.data
            resolve(newUser)
        })
        .catch(err => err)
    // })
}

function login(userNamePass) {
    var prmAnsRes = HttpService.put(`${USER_URL}/login`, userNamePass)
    prmAnsRes.catch(err => {
        console.log('Service Cought an Error - ', err);
    })
    prmAnsRes.finally(() => {
        console.log('Done handling res');
    })

    var prmAns = prmAnsRes.then(res => {
        console.log('Result- Data:', res.data);
        loggedInUser = res.data;
        localStorage.setItem(USER_STORAGE, JSON.stringify(loggedInUser));
        return res.data;
    })

    console.log('Done Sending the AJAX Request');
    return prmAns;
}

function addFollowUser(users) {
    const userId = users.followedUser._id
    return HttpService.put(`${USER_URL}/details/${userId}`, users)
}

function getGuestUser() {
    return {
        name: 'Guest',
        email: '',
        userId: '',
        userImg: '',
        dateCreated: 0,
        rating: 0,
        follow: {
            followedBy: [],
            followAfter: []
        }
    }
}