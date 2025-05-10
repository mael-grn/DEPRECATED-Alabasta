enum ErrorType {
    USER_NOT_FOUND = "Aucun utilisateur trouvé pour ce nom d'utilisateur.",
    WRONG_PASSWORD = "Le mot de passe est incorrect.",
    WRONG_TOKEN = "Le token a expiré. Merci de vous reconnecter.",
    USERNAME_TAKEN = "Un utilisateur existe déjà avec ce nom d'utilisateur. Merci d'en essayer un autre.",
    SERVER_ERROR = "Une erreur s'est produite de notre coté. Merci de réessayer plus tard.",
    NOT_VERIFIED = "Votre compte n'a pas encore été approuvé par un administrateur. Merci de réessayer plus tard.",
    MEDIA_NOT_FOUND = "Oups, le media que vous avez demandé n'existe pas. Si vous pensez qu'il s'agit d'une erreur, merci d'en faire part à un administrateur.",
    FAILED_TO_STREAM = "Impossible de démarrer le streaming de la ressource demandé.",
    TMDB_API_ERROR = "Une erreur s'est produite lors du chargement des détails du média."
}

export default ErrorType;