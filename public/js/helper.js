function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}