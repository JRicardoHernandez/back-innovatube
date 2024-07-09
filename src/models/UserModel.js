class UserModel {
    constructor(_id, _uid, name, lastName, displayName, email, registerDate, updateDate, status) {
        (this._id = _id),
        (this._uid = _uid),
        (this.name = name),
        (this.lastName = lastName),
        (this.displayName = displayName),
        (this.email = email);
        (this.registerDate = registerDate);
        (this.updateDate = updateDate);
        (this.status = status);
    }
  }
  
export default UserModel;
