export const saveUserToCache = (client, userInfo) =>
{
	const { loggedIn, _id, email } = userInfo;
	client.writeData({
		data: {
			isLoggedIn: loggedIn,
			currentUserId: _id,
			currentUserEmail: email
		}
	});
}

export const saveUserToLocalStorage = userInfo =>
{
	const { token, _id, email,  } = userInfo;
	localStorage.setItem("auth-token", token);
	localStorage.setItem("currentUserId", _id);
	localStorage.setItem("currentUserEmail", email);
}


export const saveUserToCacheAndLocalStorage = (cache, userInfo) =>
{
	const { _id, email, loggedIn } = userInfo;
	localStorage.setItem("currentUserId", _id);
	localStorage.setItem("currentUserEmail", email);
	cache.writeData({
		data: {
			isLoggedIn: loggedIn,
			currentUserId: _id,
			currentUserEmail: email
		}
	});
}

export const logoutUser = client =>
{
	localStorage.removeItem("auth-token");
	localStorage.removeItem("currentUserId");
	localStorage.removeItem("currentUserEmail");
	client.writeData({
		data: {
			isLoggedIn: false,
			_id: null,
			currentUserEmail: null
		}
	});
};