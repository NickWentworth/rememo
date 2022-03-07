const fs = require('fs');
const path = require('path');
import { capitalize } from './utility.js';

const tabDirectory = path.join(process.cwd(), 'components', 'tabs');
const tabPath = '';
const iconPath = 'images/tabIcons/';

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
            tabName: capitalize(trimmedName),
            tabPath: tabPath + trimmedName,
            iconPath: iconPath + trimmedName + '.png'
        }
    })
}
