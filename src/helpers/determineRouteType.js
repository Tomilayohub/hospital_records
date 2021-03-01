const notProtectedRoute = [
    'homepage',
    'administrator_login',
    'hospital_login',
    'patient_login'
]



export const determineRouteType = (routeName) => {
    let isNotProtected = false
    
    notProtectedRoute.map((route) => {
        if (route === routeName ) {
            isNotProtected = true
        }
    })

    return isNotProtected
}