package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type Salmon struct {
	Vessel   string `json:"vessel"` //the fieldtags are needed to keep case from bouncing around
	Datetime string `json:"datetime"`
	Location string `json:"location"`
	Holder   string `json:"holder"`
}

// ===================================================================================
// Main
// ===================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Init initializes chaincode
// ===========================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations
// ========================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "recordSalmon" { //create a new marble
		return t.recordSalmon(stub, args)
	} else if function == "changeSalmonHolder" { //change owner of a specific marble
		return t.changeSalmonHolder(stub, args)
	} else if function == "querySalmon" { //change owner of a specific marble
		return t.querySalmon(stub, args)
	} else if function == "queryAllSalmon" { //change owner of a specific marble
		return t.queryAllSalmon(stub)
	} else if function == "initLedger" { //change owner of a specific marble
		return t.initLedger(stub)
	}

	fmt.Println("invoke did not find func: " + function) //error
	return shim.Error("Received unknown function invocation")
}

// ============================================================
// initSalmon - create a new salmon, store into chaincode state
// ============================================================
func (t *SimpleChaincode) recordSalmon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error

	//   0       1      		 2     			3   			4
	// "id", "vessel", "datetime", "location", "holder"
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	// ==== Input sanitation ====
	fmt.Println("- start init marble")
	if len(args[0]) <= 0 {
		return shim.Error("1st argument must be a non-empty string")
	}
	if len(args[1]) <= 0 {
		return shim.Error("2nd argument must be a non-empty string")
	}
	if len(args[2]) <= 0 {
		return shim.Error("3rd argument must be a non-empty string")
	}
	if len(args[3]) <= 0 {
		return shim.Error("4th argument must be a non-empty string")
	}
	if len(args[4]) <= 0 {
		return shim.Error("5th argument must be a non-empty string")
	}

	id := args[0]
	vessel := args[1]
	datetime := args[2]
	location := args[3]
	holder := args[4]

	// ==== Check if marble already exists ====
	salmonAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get salmon: " + err.Error())
	} else if salmonAsBytes != nil {
		fmt.Println("This salmon already exists: " + vessel)
		return shim.Error("This salmon already exists: " + vessel)
	}

	// ==== Create salmon object and marshal to JSON ====
	var salmon = Salmon{vessel, datetime, location, holder}
	salmonJSONasBytes, err := json.Marshal(salmon)
	if err != nil {
		return shim.Error(err.Error())
	}

	// === Save salmon to state ===
	err = stub.PutState(id, salmonJSONasBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	// ==== Marble saved and indexed. Return success ====
	fmt.Println("- end init salmon")
	return shim.Success(nil)
}

// ===============================================
// queryAllSalmon - query all salmons from chaincode state
// ===============================================
func (t *SimpleChaincode) queryAllSalmon(stub shim.ChaincodeStubInterface) pb.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllTuna:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// ===============================================
// readSalmon - read a salmon from chaincode state
// ===============================================
func (t *SimpleChaincode) querySalmon(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var id, jsonResp string
	var err error

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting id of the salmon to query")
	}

	id = args[0]
	valAsbytes, err := stub.GetState(id) //get the marble from chaincode state
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + id + "\"}"
		return shim.Error(jsonResp)
	} else if valAsbytes == nil {
		jsonResp = "{\"Error\":\"Marble does not exist: " + id + "\"}"
		return shim.Error(jsonResp)
	}

	return shim.Success(valAsbytes)
}

// ===========================================================
// transfer a salmon by setting a new owner name on the salmon
// ===========================================================
func (t *SimpleChaincode) changeSalmonHolder(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	//   0       1
	// "salmon id", "transfer's name"
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	id := args[0]
	newOwner := args[1]
	fmt.Println("- start transferMarble ", id, newOwner)

	salmonAsBytes, err := stub.GetState(id)
	if err != nil {
		return shim.Error("Failed to get salmon:" + err.Error())
	} else if salmonAsBytes == nil {
		return shim.Error("Salmon does not exist")
	}

	salmonToTransfer := Salmon{}
	err = json.Unmarshal(salmonAsBytes, &salmonToTransfer) //unmarshal it aka JSON.parse()
	if err != nil {
		return shim.Error(err.Error())
	}
	salmonToTransfer.Holder = newOwner //change the owner

	salmonJSONasBytes, _ := json.Marshal(salmonToTransfer)
	err = stub.PutState(id, salmonJSONasBytes) //rewrite the marble
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end transferSalmon (success)")
	return shim.Success(nil)
}

func (t *SimpleChaincode) initLedger(stub shim.ChaincodeStubInterface) pb.Response {
	salmon := []Salmon{
		Salmon{Vessel: "923F", Location: "67.0006, -70.5476", Datetime: "1504054225", Holder: "Miriam"},
		Salmon{Vessel: "M83T", Location: "91.2395, -49.4594", Datetime: "1504057825", Holder: "Dave"},
		Salmon{Vessel: "T012", Location: "58.0148, 59.01391", Datetime: "1493517025", Holder: "Igor"},
		Salmon{Vessel: "P490", Location: "-45.0945, 0.7949", Datetime: "1496105425", Holder: "Amalea"},
		Salmon{Vessel: "S439", Location: "-107.6043, 19.5003", Datetime: "1493512301", Holder: "Rafa"},
		Salmon{Vessel: "J205", Location: "-155.2304, -15.8723", Datetime: "1494117101", Holder: "Shen"},
		Salmon{Vessel: "S22L", Location: "103.8842, 22.1277", Datetime: "1496104301", Holder: "Leila"},
		Salmon{Vessel: "EI89", Location: "-132.3207, -34.0983", Datetime: "1485066691", Holder: "Yuan"},
		Salmon{Vessel: "129R", Location: "153.0054, 12.6429", Datetime: "1485153091", Holder: "Carlo"},
		Salmon{Vessel: "49W4", Location: "51.9435, 8.2735", Datetime: "1487745091", Holder: "Fatima"},
	}

	i := 0
	for i < len(salmon) {
		fmt.Println("i is ", i)
		salmonAsBytes, _ := json.Marshal(salmon[i])
		stub.PutState(strconv.Itoa(i+1), salmonAsBytes)
		fmt.Println("Added", salmon[i])
		i = i + 1
	}

	return shim.Success(nil)
}
