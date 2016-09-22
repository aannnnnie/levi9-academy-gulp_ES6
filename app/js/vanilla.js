 /*jshint esversion: 6 */
 
(() => {
	const accountsList = [];

    function createAccount(user) {
        const account = document.createElement('DIV');
        account.setAttribute('id', user.id);
        account.classList.add('user');    	

        account.appendChild(createAvatar(user));
        account.appendChild(createLogin(user));

        return account;
    }

    function createAvatar(user) {
        const avatar = document.createElement('IMG');
        avatar.classList.add('img-circle');
        avatar.src = user.avatar_url;

        return avatar;
    }

    function createLogin(user) {
        const login = document.createElement('DIV');
        login.classList.add('font-login');
        login.innerText = user.login + (user.site_admin ? ' (admin)' : ' (user)');

        return login;
    }

    function constructDetails(sellectedAccount, selectedUserId){
        const userDetails = document.createElement('DIV');
        const selectedUser = document.getElementById(selectedUserId);

        sellectedAccount.followersList.forEach(follower => {
            const folowerLink = document.createElement('A');
            folowerLink.href = follower.url;
            folowerLink.textContent = follower.login;
            folowerLink.classList.add('element');
            userDetails.appendChild(folowerLink);
        });
        selectedUser.appendChild(userDetails);        
    }

    function toggleDetail(selectedId) {
        const selectedUser = document.getElementById(selectedId);
        if (selectedUser.lastChild.classList == 'hidden'){
            selectedUser.lastChild.classList.remove('hidden');
        } else {
            selectedUser.lastChild.classList.add('hidden');
        }            
    }

    function createTable(list) {
        const contentElement = document.getElementById('user-table');
        const tableBody = document.createElement('DIV');

        for (const element of list) {
            tableBody.appendChild(createAccount(element));
            accountsList.push(element);
        }

        contentElement.appendChild(tableBody);
        tableBody.addEventListener('click', event => {
            const selectedUserId = event.target.parentElement.id;
            if (selectedUserId){
                const selectedUser = accountsList.find(account => (account.id == selectedUserId));
                if (selectedUser.followersList) {
                    if (selectedUserId != 'user-table'){
                        toggleDetail(selectedUserId);
                    }       
                } else {
                    fetchUserDetails(selectedUser.followers_url, selectedUserId, constructDetails);
                    toggleDetail(selectedUserId);
                }
            }            
        });
    }

    function fetchUserDetails(followersUrl, selectedUserId, callback){
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                const sellectedAccount = accountsList.find(account => (account.id == selectedUserId));
                followersData = JSON.parse(request.responseText);
                sellectedAccount.followersList = followersData.map(follower => (
                    {
                        login: follower.login,
                        url: follower.html_url
                    }));
                callback(sellectedAccount, selectedUserId);       
            }
        };

        request.open("GET", followersUrl , true);
        request.send();
    }

    function init (accountsList) {
        const request = new XMLHttpRequest();
        const url = "https://api.github.com/users";

        request.onreadystatechange = () => {
            if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                accountsList = JSON.parse(request.responseText);
                createTable(accountsList);
            }
        };
        request.open("GET", url, true);
        request.send();
    }

    init();
})();

