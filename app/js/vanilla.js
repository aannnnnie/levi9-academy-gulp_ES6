 
(function() {
	var accountsList = [];

    function createAccount(user) {
        var account = document.createElement('DIV');
        account.setAttribute('id', user.id);
        account.classList.add('user');    	

        account.appendChild(createAvatar(user));
        account.appendChild(createLogin(user));

        return account;
    }

    function createAvatar(user) {
        var avatar = document.createElement('IMG');
        avatar.classList.add('img-circle');
        avatar.src = user.avatar_url;

        return avatar;
    }

    function createLogin(user) {
        var login = document.createElement('DIV');
        login.classList.add('font-login');
        login.innerText = user.login + (user.site_admin ? ' (admin)' : ' (user)');

        return login;
    }

    function constructDetails(sellectedAccount, selectedUserId){
        var userDetails = document.createElement('DIV');
        var selectedUser = document.getElementById(selectedUserId);

        sellectedAccount.followersList.forEach(function(follower){
            var folowerLink = document.createElement('A');
            folowerLink.href = follower.url;
            folowerLink.textContent = follower.login;
            folowerLink.classList.add('element');
            userDetails.appendChild(folowerLink);
        });
        selectedUser.appendChild(userDetails);        
    }

    function toggleDetail(selectedId) {
        var selectedUser = document.getElementById(selectedId);
        if (selectedUser.lastChild.classList == 'hidden'){
            selectedUser.lastChild.classList.remove('hidden');
        } else {
            selectedUser.lastChild.classList.add('hidden');
        }            
    }

    function createTable(list) {
        var contentElement = document.getElementById('user-table');
        var tableBody = document.createElement('DIV');

        for (var element of list) {
            tableBody.appendChild(createAccount(element));
            accountsList.push(element);
        }

        contentElement.appendChild(tableBody);
        tableBody.addEventListener('click', function(event){
            var selectedUserId = event.target.parentElement.id;
            if (selectedUserId){
                let selectedUser = accountsList.find(function(account) {return account.id == selectedUserId });
                if (selectedUser.followersList) {
                    if (selectedUserId != 'user-table'){
                        toggleDetail(selectedUserId);
                    };       
                } else {
                    fetchUserDetails(selectedUser.followers_url, selectedUserId, constructDetails);
                    toggleDetail(selectedUserId);
                };
            };            
        });
    }

    function fetchUserDetails(followersUrl, selectedUserId, callback){
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
                let sellectedAccount = accountsList.find(function(account){ return account.id == selectedUserId})
                followersData = JSON.parse(request.responseText);
                sellectedAccount.followersList = followersData.map(function(follower){
                    return {
                        login: follower.login,
                        url: follower.html_url
                    };
                });
                callback(sellectedAccount, selectedUserId);       
            }
        }

        request.open("GET", followersUrl , true);
        request.send();
    }

    function init (accountsList) {
        var xmlHttp = new XMLHttpRequest();
        var url = "https://api.github.com/users";

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 200) {
                accountsList = JSON.parse(xmlHttp.responseText);
                createTable(accountsList);
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    };

    init();
})();

