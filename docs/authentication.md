# Authentication

`wdi5` currently support these authentication mechanisms and/or providers:

- [SAP Cloud IdP (default BTP Identity Provider)](#sap-cloud-idp-default-btp-identity-provider)
- [SAP Cloud Identity Services - Identity Authentication (IAS)](#sap-cloud-identity-services-identity-authentication)
- [Office 365](#office-365)
- [custom IdP](#custom-idp)
- [Basic Authentication](#basic-authentication)

Generally speaking, the authentication behavior mimicks that of a regular user session: first, the `baseUrl` (from the `wdio.conf.(j|t)s`-file) is opened in the configured browser. Then, the redirect to the Authentication provider is awaited and [the credentials](#credentials) are supplied.

BTP-, IAS-, Office365- and custom IdP all supply credentials as a user would, meaning they're literally typed into the respective input fields on each login screen.  
Basic Authentication prepends username and password in encoded form to the URL, resulting in an `HTTP` `GET` in the form of `https://username:encoded-pwd@your-deployed-UI5.app`.

!> Multi-Factor Authentication is not supported as it's nearly impossible to manage any media break (e.g. browser &harr; mobile) in authentication flows out of the box

For you as users, authentication is done at design-time, meaning: **by configuration only, not programmatically**.  
This especially means that no changes in the test code are needed for using authentication in `wdi5` tests!

?> No [skipping of the UI5 injection](configuration#skipinjectui5onstart) is necessary, `wdi5` takes care of the correct order of operation (first authentication, then injecting UI5) itself.

!> Credentials can only be supplied via environment variables, not in any configuration file.  
More on the [how and why below](#credentials) :point_down:

## Configuration

In order to support the [multiremote](usage#multiple-browser-instances-multiremote) feature, configuring authentication is done via the specific `wdi5:authentication`key in the `capabilities` block of the [configuration file](configuration).

The `provider` needs to be specified, plus certain optional settings per provider. The latter allows mostly for custom [Selectors](https://webdriver.io/docs/selectors) to be passed to the `wdi5` runtime.

For a single browser:

```js
//...
baseUrl: "https://your-deployed-ui5.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": { /* ... */ }
    // ...
}
//...
```

For multiple browsers ("multiremote")

```js
//...
baseUrl: "https://your-deployed-ui5.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            "wdi5:authentication": { /* ... */ }
            // ...
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            "wdi5:authentication": { /* ... */ }
            // ...
        }
    }
}
//...
```

?> Peak at the configuration examples we dogfood to test `wdi5`'s authentication capabilities at <https://github.com/ui5-community/wdi5/tree/main/examples/ui5-ts-app/test/e2e/authentication>

### SAP Cloud IdP (default BTP Identity Provider)

<!-- tabs:start -->

#### **single browser**

```js
baseUrl: "https://your-deployed-ui5-on-btp.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": {
        provider: "BTP", //> mandatory
        usernameSelector: "#j_username", //> optional; default: "#j_username"
        passwordSelector: "#j_password", //> optional; default: "#j_password"
        submitSelector: "#logOnFormSubmit" //> optional; default: "#logOnFormSubmit"
    }
}
```

#### **multiremote**

```js
baseUrl: "https://your-deployed-ui5-on-btp.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BTP", //> mandatory
                usernameSelector: "#j_username", //> optional; default: "#j_username"
                passwordSelector: "#j_password", //> optional; default: "#j_password"
                submitSelector: "#logOnFormSubmit" //> optional; default: "#logOnFormSubmit"
            }
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BTP", //> mandatory
                usernameSelector: "#j_username", //> optional; default: "#j_username"
                passwordSelector: "#j_password", //> optional; default: "#j_password"
                submitSelector: "#logOnFormSubmit" //> optional; default: "#logOnFormSubmit"
            }
        }
    }
}
```

<!-- tabs:end -->

The `BTP` authenticator will automatically detect whether the login process is a two-step- (first username needs to be supplied, the password) or a single-step (both username and password are supplied on one screen) sequence.

### SAP Cloud Identity Services - Identity Authentication

?> only available in `wdi5` >= 2

Using the 'Identity Authentication Service (IAS) Authenticator' in `wdi5` is a subset of the [above BTP Authentication](#sap-cloud-idp-default-btp-identity-provider).  
It takes the same configuration options, plus `disableBiometricAuth` (default: `true`, which you want in almost all cases) and `idpDomain`. The latter is necessary to satisfy cookie conditions in the remote-controlled browser.  
Set `idpDomain` to the _domain-only_ part of your IAS tenant URL, e.g. `weiruhg.accounts.ondemand.com`, _omitting_ the protocol prefix (`https://`).

!> If `disableBiometricAuth` is set to `true`, `idpDomain` must be set as well!

<!-- tabs:start -->

#### **single browser**

```js
baseUrl: "https://your-deployed-ui5-on-btp.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": {
        provider: "BTP", //> mandatory
        usernameSelector: "#j_username", //> optional; default: "#j_username"
        passwordSelector: "#j_password", //> optional; default: "#j_password"
        submitSelector: "#logOnFormSubmit", //> optional; default: "#logOnFormSubmit"
        disableBiometricAuth: true, //> optional; default: true
        idpDomain: "weiruhg.accounts.ondemand.com", //> mandatory if disableBiometricAuth = true, otherwise optional; no default
    }
}
```

#### **multiremote**

```js
baseUrl: "https://your-deployed-ui5-on-btp.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BTP", //> mandatory
                usernameSelector: "#j_username", //> optional; default: "#j_username"
                passwordSelector: "#j_password", //> optional; default: "#j_password"
                submitSelector: "#logOnFormSubmit", //> optional; default: "#logOnFormSubmit"
                disableBiometricAuth: true, //> optional; default: true
                idpDomain: "weiruhg.accounts.ondemand.com", //> mandatory if disableBiometricAuth = true, otherwise optional; no default
            }
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BTP", //> mandatory
                usernameSelector: "#j_username", //> optional; default: "#j_username"
                passwordSelector: "#j_password", //> optional; default: "#j_password"
                submitSelector: "#logOnFormSubmit", //> optional; default: "#logOnFormSubmit"
                disableBiometricAuth: true, //> optional; default: true
                idpDomain: "weiruhg.accounts.ondemand.com", //> mandatory if disableBiometricAuth = true, otherwise optional; no default
            }
        }
    }
}
```

<!-- tabs:end -->

### Office 365

<!-- tabs:start -->

#### **single browser**

```js
baseUrl: "https://your-deployed-ui5-with-o365-idp.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": {
        provider: "Office365", //> mandatory
        usernameSelector: "[name=loginfmt]", //> optional; default: "[name=loginfmt]"
        passwordSelector: "[name=passwd]", //> optional; default: "[name=passwd]"
        submitSelector: "[data-report-event=Signin_Submit]", //> optional; default: "[data-report-event=Signin_Submit]"
        staySignedIn: true //> optional: whether the "Stay Signed In?"-checkbox should be checked; default: true
    }
}
```

#### **multiremote**

```js
baseUrl: "https://your-deployed-ui5-with-o365-idp.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "Office365", //> mandatory
                usernameSelector: "[name=loginfmt]", //> optional; default: "[name=loginfmt]"
                passwordSelector: "[name=passwd]", //> optional; default: "[name=passwd]"
                submitSelector: "[data-report-event=Signin_Submit]", //> optional; default: "[data-report-event=Signin_Submit]"
                staySignedIn: true //> optional: whether the "Stay Signed In?"-checkbox should be checked; default: true
            }
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "Office365", //> mandatory
                usernameSelector: "[name=loginfmt]", //> optional; default: "[name=loginfmt]"
                passwordSelector: "[name=passwd]", //> optional; default: "[name=passwd]"
                submitSelector: "[data-report-event=Signin_Submit]", //> optional; default: "[data-report-event=Signin_Submit]"
                staySignedIn: true //> optional: whether the "Stay Signed In?"-checkbox should be checked; default: true
            }
        }
    }
}
```

<!-- tabs:end -->

### Custom IdP

<!-- tabs:start -->

#### **single browser**

```js
baseUrl: "https://your-deployed-ui5-with-custom-idp.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": {
        provider: "custom", //> mandatory
        usernameSelector: "input[id='username']", //> mandatory
        passwordSelector: "input[id='password']", //> mandatory
        submitSelector: "button[type='submit']" //> mandatory
    }
}
```

#### **multiremote**

```js
baseUrl: "https://your-deployed-ui5-with-custom-idp.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "custom", //> mandatory
                usernameSelector: "input[id='username']", //> mandatory
                passwordSelector: "input[id='password']", //> mandatory
                submitSelector: "button[type='submit']" //> mandatory
            }
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "custom", //> mandatory
                usernameSelector: "input[id='username']", //> mandatory
                passwordSelector: "input[id='password']", //> mandatory
                submitSelector: "button[type='submit']" //> mandatory
            }
        }
    }
}
```

<!-- tabs:end -->

### Basic Authentication

<!-- tabs:start -->

#### **single browser**

```js
baseUrl: "https://caution_your-deployed-ui5-with-basic-auth.app",
capabilities: {
    // browserName: "..."
    "wdi5:authentication": {
        provider: "BasicAuth" //> mandatory
    }
}
```

#### **multiremote**

```js
baseUrl: "https://caution_your-deployed-ui5-with-basic-auth.app",
capabilities: {
    // "one" is the literal reference to a browser instance
    one: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BasicAuth" //> mandatory
            }
        }
    },
    // "two" is the literal reference to a browser instance
    two: {
        capabilities: {
            // browserName: "..."
            "wdi5:authentication": {
                provider: "BasicAuth" //> mandatory
            }
        }
    }
}
```

<!-- tabs:end -->

## Credentials

Exposing credentials in configuration files that were accidentally checked into version control is one of the most common causes of data leaks. That's why `wdi5` only allows providing credentials through environment variables at runtime.

!> credentials are only picked up by `wdi5` from the environment!

There are multiple ways to achieve that in Node.js, with [using the `dotenv`-module](https://www.npmjs.com/package/dotenv) being one of the most popular: `dotenv` automatically transfers all variables from a `.env`-file into the environment of the app at runtime.

In single browser scenarios, `wdi5_username` and `wdi5_password` need to be provided.  
In multiremote scenarios, credential keys in the environment adhere to `wdi5_$browserInstanceName_username` and `wdi5_$browserInstanceName_password`.

<!-- tabs:start -->

#### **single browser**

```shell
wdi5_username='ken@thompson.org'
wdi5_password='p/q2-q4'
```

#### **multiremote**

```shell
# multiremote browser capability config is "one"
wdi5_one_username='brian@kernighan.org'
wdi5_one_password='/.,/.,'
# multiremote browser capability config is "two"
wdi5_two_username='steve@bourne.org'
wdi5_two_password='bourne'
# multiremote browser capability config is "nix"
wdi5_nix_username='dennis@ritchie.org'
wdi5_nix_password='dmac'
```

<!-- tabs:end -->

## Miscellaneous

Why the `wdi5:...` prefix?  
Because the W3C standard for providing options in the WebDriver protocol asks for any vendor-specfic setting to have a unique prefix.
