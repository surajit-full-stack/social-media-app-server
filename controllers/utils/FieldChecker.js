function cheackBody(obj, arr) {
    const required = arr.filter((it) => !obj.hasOwnProperty(it));
    console.log("required", required);
    if (required.length===0) return false;
  
    return `Required field is ${required.join(",")}`;
  }

  export default cheackBody