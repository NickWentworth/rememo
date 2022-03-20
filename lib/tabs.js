const fs = require('fs');
const path = require('path');

const tabDirectory = path.join(process.cwd(), 'components', 'tabs');
const tabPath = '/';
const iconPath = '/images/icons/';

export function getAllTabNames() {
    let tabNames = fs.readdirSync(tabDirectory);

    return tabNames.map((name) => {
        return {
            params: {
                tab: name.replace('.js', '')
            }
        }
    })
}

export function getAllTabData() {
    let tabNames = fs.readdirSync(tabDirectory);

    return tabNames.map((name) => {
        let trimmedName = name.replace('.js', '');

        return {
            tabName: trimmedName,
            tabPath: tabPath + trimmedName,
            iconPath: iconPath + trimmedName + '.svg'
        }
    })
}
