import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {SocialIcon, Button} from 'react-native-elements';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import FBSDK, {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
const Login = () => {
  //Google
  const [inProgress, setProgress] = useState(false);
  const [user, setUser] = useState(null);

  //facebook
  const [name, setName] = useState('');
  const [fbtoken, setFbtoken] = useState(null);
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '347269432027-t5pb6d8q21ka83qvo7a5lsj8g7tbc4gl.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      // forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '347269432027-aacpsl6cogb4r57nlqhehih69tqkb0th.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  });

  const onGooglePress = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) return alert('Signed in already');
      //Start Google login
      setProgress(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUser(userInfo.user);
      setProgress(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onFacebookPress = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      if (result.isCancelled) {
        alert('login is cancelled.');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        setFbtoken(data.token);
        makeGraphReq(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const makeGraphReq = data => {
    const profileRequestConfig = {
      httpMethod: 'GET',
      version: 'v2.12',
      parameters: {
        fields: {
          string: 'id, name, email,picture',
        },
      },
      accessToken: data.token,
    };
    const infoRequest = new GraphRequest(
      '/me',
      profileRequestConfig,
      responseInfoCallback,
    );
    //Start the request
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  //Create response callback.
  const responseInfoCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      setName(result.name);
      setPic(result.picture.data.url);
    }
  };

  onLogout = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      console.warn('singout success');
    } catch (error) {
      console.error(error);
    }
  };

  const {mainContainer} = styles;
  return (
    <View style={mainContainer}>
      <SocialIcon
        style={{width: '70%'}}
        title="Sign In With Facebook"
        button
        onPress={onFacebookPress}
        type="facebook"
      />
      <SocialIcon
        style={{width: '70%'}}
        title="Sign In With Google"
        button
        onPress={onGooglePress}
        type="google"
      />
      {/* //Google Design */}
      <Text>{user && user.givenName}</Text>
      <Text>{user && user.email}</Text>
      {user && (
        <Image
          source={{uri: user.photo}}
          style={{width: 200, height: 200}}
          resizeMode={'contain'}
        />
      )}
      {/* //Facebook Design */}
      <Text>{name}</Text>
      <Text>{email}</Text>
      {pic && (
        <Image
          source={{uri: pic}}
          style={{width: 200, height: 200}}
          resizeMode={'contain'}
        />
      )}
      <Button title={'Logout'} onPress={onLogout} style={{margin: 20}} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
