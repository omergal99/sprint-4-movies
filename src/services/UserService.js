import HttpService from './HttpService';

const USER_URL = HttpService.getUrl('user');

const resolveData = res => res.data;

export default {
    getUsers,
    add,
    isNameNotInUse,
    remove,
    getGuestUser,
    getById,
    login,
    addFollowUser
}

var users = require('../../data/users_db.json');

function getUsers(userId) {
    var prm = getById(userId)
        .then((findedUser) => {
            if (findedUser.isAdmin) {
                return Promise.resolve(users);
            } else {
                return Promise.reject('User have not permission');
            }
        })
        .catch((err) => {
            return Promise.reject('Error in find by id - ', err);
        })
    return prm;
}

function getById(userId) {
    return HttpService.get(`${USER_URL}/${userId}`)
        .then(resolveData)
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

function remove(userId) {
    var userIdx = users.findIndex(user => user.userId === userId);
    if (userIdx === -1) return Promise.reject('Not Found');
    users.splice(userIdx, 1)
    return _saveUsersToFile();
}

function add(newUser) {
    var fullNewUser = getGuestUser();
    fullNewUser.name = newUser.name;
    fullNewUser.password = newUser.pass;
    // fullNewUser.userId = _makeId();
    fullNewUser.isAdmin = false;
    users.push(fullNewUser);
    return Promise.resolve(fullNewUser);

    // return _saveUsersToFile().then(() => user);
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
        return res.data;
    })

    console.log('Done Sending the AJAX Request');
    return prmAns;
}

function isNameNotInUse(name) {
    var user = users.find(user => {
        return (user.name.toLowerCase() === name.toLowerCase())
    });
    if (!user) {
        return Promise.resolve('No user with this name');
    } else {
        return Promise.reject('There is user with this name!');
    }
}

function addFollowUser(users){
    const userId = users.followedUser
    return HttpService.put(`${USER_URL}/details/${userId}`, users)

}

