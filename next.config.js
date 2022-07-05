module.exports = {
    redirects: async () => {
        return [
            {
                // TODO - probably redirect to dashboard when it is created
                // redirect to tasks from root
                source: '/',
                destination: '/tasks',
                permanent: true
            }
        ]
    }
}