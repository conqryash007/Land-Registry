pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract LandRecord{
    uint public personCount = 0;
    uint public plotCount = 0;
    uint public adminCount = 0;
    address public govtGSTAddr ;
    
    constructor(address _govt)public{
        govtGSTAddr = _govt;
    }
    
    
    struct Person{
        uint personId;
        uint perAadharno;
        uint[] inheritChildren;
        
    }
    
    event plotAdded(uint plotId,string plotAddr,uint price,uint[] owner,uint times);
    event plotSale(uint plotId,bool isSelling,uint[] owner,uint sellingPrice,uint times);
    event plotForBuy(uint plotId, uint256 newowner,uint price,uint times);
    event plotTransferred(uint plotId,uint256[] oldowner,uint256 newowner,uint sellPrice,uint times);
    event eventConsensus(uint plotId, address sender,bool decision,uint times);
    
    mapping(uint=>Person) public personIds;
    mapping(uint=>Person) public personaadhars;
    
    
    struct Plot{
        uint plotId;
        string plotaddr;
        uint plotprice;
        uint taxpercent;
        string typedesc;
        uint256[] owneraadhar;
        bool isSelling;
        uint sellingPrice;
        uint256 newowneraadhar;
        string neighbours;
        bool[] consensus;
        string imageurl;
        bool inprocess;
    }
    
    mapping(uint => Plot) public Plots;
    
    struct Admin{
        uint adminId;
        uint adminaadharno;
        address adminaddr;
        string role;
        
    }
    
    mapping(address=>Admin) public Admins;
    mapping(uint=>address) public AdminIds;
    mapping(uint=>Admin) public Adminaadhars;
    
    modifier plotowneroradmin(uint256 plotId,uint _aadhar) {
        bool x = false;
        for(uint i=0;i<Plots[plotId].owneraadhar.length;i++){
             if(Plots[plotId].owneraadhar[i]  == _aadhar){
                 x = true;
             }
        }
        if(Admins[msg.sender].adminId != 0 ){
            x = true;
        }
        require(x == true);
        _;
    }
    
    modifier adminonly() {
        require(Admins[msg.sender].adminId != 0);
        _;
    }
    
    function addPerson(uint _perAadharno,uint256[] calldata _inheritChildren) public adminonly returns(uint){
        uint x = personaadhars[_perAadharno].personId;
        if(x == 0){
            Person memory aux;
            personCount++;
            aux.personId = personCount;
            aux.perAadharno = _perAadharno;
            aux.inheritChildren = _inheritChildren;
            personIds[personCount] = aux;
            personaadhars[_perAadharno] = aux;
            return personCount;
            
        }
        else{
            Person memory aux = personaadhars[_perAadharno];
            aux.inheritChildren = _inheritChildren;
            personIds[_perAadharno] = aux;
            personaadhars[aux.personId] = aux;
            return personCount;            
        }
        
    }
    
    function addAdmin(uint _adminaadharno,string memory _role) public returns(uint){
        uint x = Admins[msg.sender].adminId;
        if(x == 0){
            adminCount++;
            Admin memory aux;
            aux.adminId = adminCount;
            aux.adminaadharno = _adminaadharno;
            aux.adminaddr = msg.sender;
            aux.role = _role;
            Admins[msg.sender] = aux;
            AdminIds[adminCount] = msg.sender;
            Adminaadhars[_adminaadharno] = aux;
            return adminCount;
            
        }
        else{
            Admin memory aux = Admins[msg.sender]; 
            aux.adminaadharno = _adminaadharno;
            aux.role = _role;
            Admins[msg.sender] = aux;
            
        }
    }
    
    function addPlot(string memory _plotaddr,uint _plotprice,uint _taxpercent,string memory _typedesc,uint256[] memory _owneraadhar,string memory _neighbours,string memory _imageurl) public returns(uint){
       plotCount++;
       Plot memory aux;
       aux.plotId = plotCount; 
       aux.plotaddr = _plotaddr;
       aux.plotprice = _plotprice;
       aux.owneraadhar = _owneraadhar;
       aux.taxpercent = _taxpercent;
       aux.typedesc = _typedesc;
       aux.neighbours = _neighbours;   
       aux.imageurl = _imageurl;
       aux.inprocess = false;
       Plots[plotCount] = aux;
       emit plotAdded(plotCount,_plotaddr,_plotprice,_owneraadhar,now);
       return plotCount;
    }
    
    function putForSale(uint _plotId,uint _price,uint _aadhar)public plotowneroradmin(_plotId,_aadhar){
        Plot memory aux = Plots[_plotId];
        require(aux.inprocess == false);
        aux.isSelling = true;
        aux.sellingPrice = _price;
        Plots[_plotId] = aux;
        emit plotSale(_plotId,true,aux.owneraadhar,_price,now);
    }
    
    function desale(uint _plotId,uint _aadhar) public plotowneroradmin(_plotId,_aadhar){
        Plot memory aux = Plots[_plotId];
        require(aux.inprocess == false);
        aux.isSelling = false;
        aux.sellingPrice = 0;
        Plots[_plotId] = aux;
        emit plotSale(_plotId,false,aux.owneraadhar,0,now);
    }
    
    function addTax(uint _plotId,uint _taxpercent)public {
        Plot memory aux = Plots[_plotId];
        aux.taxpercent = _taxpercent;
        Plots[_plotId] = aux;
    }
    
    
    function buyLand(uint _plotId,uint _aadhar)public {
        Plot memory aux = Plots[_plotId];
        require(aux.inprocess == false);
        aux.newowneraadhar = _aadhar;
        aux.inprocess = true;
        Plots[_plotId] = aux;
        emit plotForBuy(_plotId,_aadhar,aux.sellingPrice,now);
    }
    
    
    function consensus(uint _plotId,bool _dec)public{
        Plot storage aux = Plots[_plotId];
        Plots[_plotId].consensus.push(_dec);  //push true or false in array of boolean
        emit eventConsensus(_plotId,msg.sender,_dec,now);
        uint participants = aux.consensus.length; //check for current length of array of boolean
        require(participants<=adminCount);
        if( participants >= ((adminCount/2)+1)){    //check for more than 50% participants voted or not
            uint nostrue;
            for(uint i = 0; i < participants;i++){
                if(aux.consensus[i]){
                    nostrue++;
                }
            }
            if((2*nostrue)>=adminCount){         //if more than or equal to 50 % no. of true present // do action 
                transfer(_plotId);
            }
        }
    }
    
    function transfer(uint _plotId)private{
        Plot memory aux = Plots[_plotId];
        aux.plotprice = aux.sellingPrice;
        aux.isSelling = false;
        aux.sellingPrice = 0;
        aux.inprocess = false;
        uint[] memory oldowner = aux.owneraadhar;
        uint x = aux.newowneraadhar;
        aux.newowneraadhar = 0;
        Plots[_plotId] = aux;
        delete Plots[_plotId].owneraadhar;
        Plots[_plotId].owneraadhar.push(x);
        plotTransferred(_plotId,oldowner,x,aux.plotprice,now);
    }
    
    function expirePerson(uint _plotId)public{
        uint256[] memory x = Plots[_plotId].owneraadhar;
        Person memory aux = personaadhars[x[0]];
        delete Plots[_plotId].owneraadhar;
        Plots[_plotId].owneraadhar = aux.inheritChildren;
        
    }
    function getowner(uint _plotId)public view returns(uint[] memory){
        return Plots[_plotId].owneraadhar;
    }
    
    function getconsensus(uint _plotId)public view returns(bool[] memory){
        return Plots[_plotId].consensus;
    }
    
}