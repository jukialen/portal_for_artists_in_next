export default {
  title: "Portal for artists",
  Nav: {
    signIn: "Log In",
    signUp: "Sign up",
    signOut: "Sign out",
    account: "Account",
    home: "Home",
    groups: "Groups",
    friends: "Friends",
    search: "Search",
    profile: "Profile"
  },
  NavForm: {
    setErrorMessage: "We weren't able to register you.",
    theSameEmail: "Account with this e-mail already exists. Please sign in instead.",
    unVerified: "Unverified e-mail.",
    wrongLoginData: "Email password combination is incorrect.",
    statusLogin: "You're logged in",
    notExist: "User doesn't exist.",
    validateRequired: "Required",
    validateUsernameFl: "First letter must be a big.",
    validateUsernameHKik: "Name accept only letters. These can be Hiragana, Katakana and kanji characters",
    validateUsernameNum: "Name cannot include numbers.",
    validateUsernameMin: "Name is too short.",
    validatePseudonymNum: "Pseudonym must have at least 1 number.",
    validatePseudonymSpec: "Pseudonym must include at least 1 special character: #?!@$%^&*-＃？！＄％＆＊ー",
    validatePseudonymHKik: "Pseudonym accept only letters. These can be Hiragana, Katakana and kanji characters",
    validatePseudonymMin: "Pseudonym is too short.",
    validatePseudonymMax: "Pseudonym is too long. Must have a maximum 15 letters.",
    validateEmail: "Invalid email address",
    validatePasswordNum: "Password is too short. Must have a minimum 9 letters.",
    validatePasswordOl: "Password must have at least 1 bid letter.",
    validatePasswordHKik: "Password accept only letters. These can be Hiragana, Katakana and kanji characters.",
    validatePasswordOn: "Password must have at least 1 number.",
    validatePasswordSpec: "Password must include at least 1 special character: #?!@$%^&*-",
    titleOfRegistration: "Welcome to Pfartists!",
    titleOfLogin: "Login!",
    email: "E-mail",
    password: "Password",
    createSubmit: "Register",
    loginSubmit: "Login",
    loadingRegistration: "I'm registering you...",
    successInfoRegistration: "Congratulation! You are registered. Check your mailbox and confirm your e-mail in order to you'll can sign in.",
    forgottenPasswordLink: "I forgot my password",
    providerTitleRegistration: "Or register yourself using:",
    providerTitleLogin: "Or login via:",
    acceptInfoOne: "By signing up, you agree to our ",
    acceptInfoTwo: "Terms of Service",
    acceptInfoThree: " and ",
    acceptInfoFour: "Privacy Policy",
    dot: ".",
    changeToCreate: "Already have an account? ",
    changeToLogin: "Don't have an account? "
  },
  Aside: {
    category: "Categories",
    drawings: "Drawings",
    realistic: "Realistic",
    manga: "Manga",
    anime: "Anime",
    comics: "Comics",
    photographs: "Photographs",
    animations: "Animations",
    videos: "Videos",
    others: "Others",
    friends: "Favorite friends",
    groups: "Favorite groups",
    addingGroup: "Adding a group",
    photos: "Photos"
  },
  Footer: {
    termsOfUse: "Terms of use",
    privacyPolice: "Privacy police",
    contact: "Contact",
    plans: "Plans",
    faq: "FAQ",
    changeLanguage: "Language"
  },
  App: {
    lastDrawings: "Last drawings",
    lastPhotos: "Last photos",
    lastOthers: "Last others",
    lastAnimations: "Last animations",
    lastVideos: "Last videos"
  },
  Account: {
    aMenu: {
      general: "General",
      gallery: "Gallery",
      profile: "Profile",
      friends: "Friends",
      groups: "My groups"
    },
    aData: {
      subscription: "Subscription",
      currentPlan: "current plan",
      changeButton: "Change",
      actualEmail: "Current e-mail",
      changeEmail: "Change e-mail",
      currentPassword: "Enter current password",
      oldPassword: "Enter old password",
      newPassword: "Enter new password",
      againNewPassword: "Repeat new password",
      changePassword: "Change password",
      Premium: {
        header: "Change a subscription",
        select__error: "You didn't choose plan.",
        body: "To learn about plans, click this ",
        bodyLink: "link",
        bodyDot: ".",
        update: "Update"
      },
    },
      gallery: {
        userPhotosTitle: "Your photos and draws",
        userLikedPhotos: "Liked photos and draws",
        userVideosTitle: "Your videos",
        userLikedVideos: "Liked by others",
        userAnimationsTitle: "Your animations",
        userLikedAnimations: "Liked　animations"
      },
      profile: {
        aboutMe: "About me",
        ariaLabelButton: "Updating pseudonym and description button",
        save: "Save",
        successSending: "Profile has been updated.",
        errorSending: "Profile hasn't been updated.",
        defaultAvatar: "default avatar",
        userAvatar: "avatar"
      },
      groups: {
        adminTitle: "Groups which you've created",
        noAdmin: "You've created any group yet.",
        modsTitle: "Groups which you manage",
        noMods: "You're not moderators in any group yet.",
        usersTitle: "Groups you've joined",
        noUsers: "You didn't join to any group yet."
      }
    },
  Main: {
    title: "Welcome, artist!",
    firstQuestion: "Are you searching a service, which will be dedicated you?",
    secondQuestion: "Are oyu searching a service will hold up as graphical diary? And maybe do you want to show off your artistic works?",
    firstAnswer: "You hit good! This is service dedicated such people as you.",
    secondAnswer: "From Sunday artists to people creating their virtual handy portfolios.",
    containerFirstQuestion: "Short film? Any Gif? Drawing? Picture? Photo?",
    containerFirstAnswer: "No problem! You send and already done!",
    containerSecondQuestion: "Do you want to see, what others are doing?",
    containerSecondAnswer: "Click on the nickname and browse.",
    containerThirdQuestion: "Do you want to see what is at the top?",
    containerThirdAnswer: "You already have this on the main page. Being enough you log in!",
    containerFourthQuestion: "Do you want to see what lately you liked?",
    containerFourthAnswer: "Being enough you log in and you already have this!",
    containerFifthQuestion: "Design?",
    containerFifthAnswer: "Of course minimalist! Yours to be on top, not ours. This also makes everything clearer.",
    containerSixthQuestion: "Don't you like bright site?",
    containerSixthAnswer: "So click and you've Dark mode!",
    containerSeventhQuestion: "Do you want to find something about specific type?",
    containerSeventhAnswer: "Choose the appropriate category.",
    containerEighthQuestion: "Do you search people about similar likings?",
    containerEighthAnswer: "Choose a group or, better, you'll create it yourself!",
    containerNinthQuestion: "Do you have artistic friends here?",
    containerNinthAnswer: "You always have their on hand. Fast, so you know what they showed off recently."
  },
  NewUser: {
    title: "Adding your name and pseudonym",
    name: "Name",
    ariaLabelButton: "sending first data",
    successSending: "Profile has been updated.",
    errorSending: "Profile hasn't been updated."
  },
  AnotherForm: {
    pseudonym: "Pseudonym",
    profilePhoto: "Profile photo",
    description: "Description",
    fileTitle: "Adding a file",
    tags: "Tags",
    file: "File",
    send: "Send",
    uploadFile: "File has been uploaded.",
    notUploadFile: "File hasn't been uploaded."
  },
  AddingGroup: {
    title: "Create a group",
    name: "Group name"
  },
  Groups: {
    join: "Join",
    joined: "Joined",
    favorite: {
      addedToFav: "Favorite",
      addToFavorite: "Add to favourite",
      maxFav: "You can add up to 5 groups.",
      maximumAchieved: "You already have 5 favorite groups."
    },
    menu: {
      members: "Members"
    },
    addingPost: {
      add: "Add post",
      addTitPlaceholder: "Title",
      addTitAria: "Adding a title for new post",
      addDescription: "Description",
      addDesAria: "Adding a description for new post"
    },
    list: {
      title: "Groups list",
      more: "More",
      all: "These are already all groups."
    },
    noGroups: "No favorite group",
    noPermission: "In order to can see a posts, you need to join to the group."
  },
  Friends: {
    add: "Add to friends",
    added: "Friend",
    addFav: "Add to favorite",
    addedFav: "Favorite",
    max: "You can add up to 5 friends.",
    addedMax: "You already have 5 favorite friends.",
    noFriends: "No friends",
    noFavFriends: "No favorites"
  },
  groupsUser: {
    adminTitle: "Groups which the user've created",
    noAdmin: "User've created any group yet.",
    modsTitle: "Groups which the user manage",
    noMods: "User're not moderators in any group yet.",
    usersTitle: "Groups user've joined",
    noUsers: "User didn't join to any group yet."
  },
  Posts: {
    likeAria: "to like",
    likedAria: "liked",
    noPosts: "No posts"
  },
  Members: {
    admin: "Admin",
    moderators: "Moderators",
    modsAria: "Removing a moderator",
    noMods: "No moderators",
    anotherMembers: "Members",
    noMembers: "No members",
    addModAria: "Add a moderator"
  },
  Description: {
    textPlaceholder: "new description of group",
    textAria: "field for new description",
    submit: "Update",
    iconButton: "menu admin for the description"
  },
  Comments: {
    comments: "Comments",
    reply: "Reply",
    newComPlaceholder: "Write new comment",
    newComAria: "Adding description for new comment",
    newComButton: "Adding a comment",
    noComments: "No comments",
    updateTitle: "Edit comment",
    updateButton: "Update",
    deleteCommentTitle: "Delete comment"
  },
  Regulations: {
    regulation: "regulation",
    noRegulation: "No regulation"
  },
  ZeroFiles: {
    drawings: "No your drawings.",
    photos: "No your photos.",
    others: "No your others.",
    animations: "No your animations.",
    videos: "No your videos.",
    files: "No found files."
  },
  Forgotten: {
    title: "Did you forget your password?",
    subtitle: "Please enter your e-mail.",
    buttonAria: "button to reset the button",
    success: "Check your mailbox."
  },
  NewPassword: {
    title: 'Update password',
    subtitle: 'Write new password.',
    buttonAria: 'Button for sending a new password',
    success: 'You changed your password',
  },
  ResetPassword: {
    wrongValues: "Values aren't the same.",
    success: "Password reset successful!",
    failed: "Password reset failed. Please try again."
  },
  PasswordAccount: {
    differentPasswords: "Passwords aren't the same.",
    buttonAria: "button to update the password",
    success: "The password has been updated."
  },
  DeletionFile: {
    loadingText: "Deleting",
    deletionButton: "Deletion",
    title: "Delete File",
    question: "Are you sure? You can't undo this action afterwards.",
    cancelButton: "Cancel",
    deleteButton: "Delete",
    deleting: "Deleting the file.",
    deleted: "The file has deleted."
  },
  DeletionPost: {
    title: "Delete the post",
    deleting: "Deleting the post.",
    deleted: "The post has deleted."
  },
  Contact: {
    title: "Welcome! I enjoy that  you want to contact to me.",
    subTitleFirst: "If you want to give the opinion or a problem, send form. Thanks to these messages, you help me to improvement this service.",
    toFAQ: "You also can check ",
    toFAQHere: "Frequently Asked Questions",
    dot: ".",
    chooseTitle: "Choose a title",
    suggestion: "Suggestion",
    problem: "Problem",
    success: "E-mail was sent. I thank you for the message.  As soon as possible, I'll deal with the problem or consider the suggestion.",
    fail: "E-mail wasn't sent. Check your Internet connection.",
    titleInput: "Title",
    message: "Message",
    ariaSend: "button for sending a e-mail"
  },
  FAQ: {
    head1: "Is using the service free?",
    body1: "Yes. The service can be used free of charge. However, to take advantage of the additional benefits, PREMIUM or GOLD plan must be purchased.",
    head2: "What benefits do the PREMIUM and GOLD PLANS offer?",
    body2: "That plans provide client support (priority - GOLD) and smaller files size limits. You can find out more about the plans ",
    body2Link: "here",
    body2dot: ".",
    head3: "Is PREMIUM/GOLD plan needed to use the service?",
    body3: "No, isn't needed. You can use the service with FREE plan.",
    head4: "How can I delete my account?",
    body4: "All you need to do is click in the 'Delete' button at the bottom of page in first bookmark of Account subpage and confirm your selection. After confirm, the deletion all your data begins."
  },
  DeletionAccount: {
    button: "Delete",
    title: "Delete the account",
    body: "Are you sure? You won't can undo this action afterwards.",
    cancel: "Cancel",
    deletionAccount: "Deleting the account"
  },
  Plans: {
    title: "Pfartists plans",
    subTitle: "Choose plan, which is the best for you",
    period: "/MONTHLY",
    grLength: "Unlimited graphics files*",
    animLength: "Unlimited animations*",
    vidLength: "Unlimited videos*",
    grAnimSize: "Graphics files and animations size up 1 MB",
    grAnimSizeP: "Graphics files and animations size up 3MB",
    grAnimSizeG: "Graphics files and animations size up 5MB",
    vidSize: "Videos size up 15 MB",
    vidSizeP: "Videos size up 50MB",
    vidSizeG: "Videos size up 200MB",
    noAds: "No ads",
    support: "Client support**",
    pSupport: "Priority Client support***",
    choosePlan: "Choose Plan",
    formats: "* supported formats: ",
    supInfo: "** contact through e-mail within 4 working days",
    pSupInfo: "*** contact through e-mail within 2 working days. Additionally access to Slack."
  },
  EmailVerification: {
    sendedSuccess: "Please check your email and click the link in it.",
    expired: "The verification code is expired or invalid. Please click the button to send new email verification link again.",
    verified: "You verified your e-mail."
  },
  Settings: {
    title: "Settings",
    appearance: "Appearance",
    dark_mode: "Dark mode"
  },
  Date: {
    second: "s",
    minute: "m",
    hour: "h",
    day: "d",
    yearDateSeparator: "."
  },
  unknownError: "Oops! Something went wrong.",
  error: "Try again or check your internet connection.",
  edit: "Edit",
  cancel: "Cancel",
  chooseTag: "Choose tag"
} as const;
