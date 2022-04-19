console.log('resetting tasks'); // doesn't work exactly as a database would because this is ran again on new connection, resetting stored data
let tasks = [
    { name: 'Homework A', class: 'Math', color: '#54C6EB', description: '.........', dueDate: '2022-04-17', dueTime: '23:59', progress: 0 },
    { name: 'Homework B', class: 'Science', color: '#06D6A0', description: '.........', dueDate: '2022-04-21', dueTime: '23:59', progress: 0 },
    { name: 'Homework C', class: 'English', color: '#F39237', description: '.........', dueDate: '2022-04-23', dueTime: '', progress: 0 }
]

// selects all tasks matching a given userID
export default async (req, res) => {
    let userID = req.query.userID;

    // TODO - setup a database and select from it

    switch (req.method) {
        case 'POST':
            let body = JSON.parse(req.body);
            tasks = body.tasks;

            res.status(200).end();
            break;
        case 'GET':
            res.status(200).end(JSON.stringify(tasks));
            break;
    }
}
