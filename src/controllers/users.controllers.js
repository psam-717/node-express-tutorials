export const displayHomeMessage = async (req, res) => {
    try {
        return res.status(200).json({
            success: true, 
            message: 'Welcome to masterclass backend'
        })
    } catch (error) {
       console.error(error);
       return res.status(500).json({success: false, message: 'Internal server error occurred while displaying home message'}) 
    }
};

export const createDummyUser = async(req, res) => {
    try {
        const user = {
            firstName: 'Marvin',
            lastName: "Annorbah",
            email: "marv@gmail.com"
        }

        return res.status(200).json({
            success: true,
            message: 'User data displayed successfully',
            data: user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Internal server error while displaying user data'})
    }
}


