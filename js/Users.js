/** @class User represents a User object */
class User {
/**
 * Creates an instance of User.
 *
 * @constructor
 * @author: krobinson
 * @param {string} id local id to track the user
 * @param {string} image url to user image.
 * @param {string} first user's first name
 * @param {string} last user's last name
 * @param {string} email user's email address
 * @param {string} location user's location
 * @param {string} cellPhone user's cellPhone
 * @param {string} fullAddress user's fullAddress
 * @param {string} birthday user's birthday
 */

  constructor (id, image, first, last, email, location, cellPhone, fullAddress, birthday) {
    this.id = id;
    this.image = image;
    this.first = first;
    this.last = last;
    this.email = email;
    this.location = location;
    this.cellPhone = cellPhone;
    this.fullAddress = fullAddress;
    this.birthday = birthday;
  }

  getId () {
    return this.id;
  }

  getImage () {
    return this.image;
  }

  getFullName () {
    return `${this.getFirst()} ${this.getLast()}`;
  }

  getFirst () {
    return this.first;
  }

  getLast () {
    return this.last;
  }

  getEmail () {
    return this.email;
  }

  getLocation () {
    return this.location;
  }

  getCellphone () {
    const regexPat = /\d+/g;
    const phoneArr = this.cellPhone.match(regexPat);
    return `(${phoneArr[0]}) ${phoneArr[1]}-${phoneArr[2]}`;
  }

  getStreetAddress () {
    const addressObj = this.getFullAddress();
    return `
    ${addressObj.street.number} ${addressObj.street.name} <br>
    ${addressObj.city}, ${addressObj.state}  ${addressObj.postcode}`;
  }

  getFullAddress () {
    return this.fullAddress;
  }

  getBirthday () {
    const regexPat = /\d+/g;
    const birthArr = this.birthday.match(regexPat);
    return `${birthArr[1]}/${birthArr[2]}/${birthArr[0]}`;
  }

  containsText (inString) {
    let doesContainText = false;
    if (this.getFirst().toLowerCase().includes(inString)) {
      doesContainText = true;
    }
    if (this.getLast().toLowerCase().includes(inString)) {
      doesContainText = true;
    }
    if (this.getStreetAddress().toLowerCase().includes(inString)) {
      doesContainText = true;
    }
    if (this.getEmail().toLowerCase().includes(inString)) {
      doesContainText = true;
    }
    if (this.getCellphone().toLowerCase().includes(inString)) {
      doesContainText = true;
    }
    return doesContainText;
  }
}
