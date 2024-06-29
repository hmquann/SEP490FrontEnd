import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const inputClasses =
  "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500";
const buttonClasses =
  "bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500";
const labelClasses = "block text-sm font-medium text-zinc-700 mb-2";
const RegisterMotorbikeStep2 = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const[addressDetail,setAddressDetail]=useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const receiveData = location.state.formData;

  const [checkDelivery,setCheckDelivery]=useState(true);
  const[checkLocation,setCheckLocation]=useState(true);
  const[formData,setFormData]=useState(receiveData);
  const[overtimeFeeError,setOvertimeFeeError]=useState();
  const[priceError,setPriceError]=useState();
  const[overtimeLimitError,setOvertimeLimitError]=useState();
  const[deliveryFeeError,setDeliveryFeeError]=useState();
  const[freeshipError,setFreeshipError]=useState();

  useEffect(() => {
    fetch("https://vapi.vnappmob.com/api/province")
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data); 
        if (data && data.results) {
          setProvinces(data.results); // Điều chỉnh theo cấu trúc dữ liệu thực tế
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);
  const handleCheckDelivery = (event) => {
    setCheckDelivery(!event.target.checked);
    setFormData({
      ...formData,
      delivery:checkDelivery
    })
  };
  const handleCheckLocation=(event)=>{
    setCheckLocation(!event.target.checked)

  }
  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    const selectedProvince = provinces.find(d => d.province_id === provinceId);
    setSelectedProvince(provinceId);
    // Fetch districts based on selected province
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {

        if (data && data.results) {
          
          setDistricts(data.results);
          setWards([]);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDistrictChange = (event) => {
    const districtId = event.target.value;
    const selectedDistrict = districts.find(d => d.district_id === districtId);
    setSelectedDistrict(districtId);
    // Fetch wards based on selected district
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {

        if (data.results.length === 0) {
          console.log("No wards available");
          setWards([]); // Clear wards if no wards are available
        }
        if (data && data.results) {
          setWards(data.results);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        setError(error);
      });
  };
  const handleWardChange = (event) => {
    const wardId = event.target.value;
    const selectedWard = wards.find(d => d.ward_id === wardId);
    setSelectedWard(wardId);   
  };
  const regexValueInput=(input)=>{
    const regex=/^(?:[0-9]|[1-9][0-9]{0,5}|1000000)$/
      return regex.test(input);
  }
  const handleChange = (e) => {
    const {name,value}=e.target;
      if(name==="overtimeFee"){
        if(!regexValueInput(value)){
          setOvertimeFeeError("Must be number")
        }
        if(value===""){
          setOvertimeFeeError("Not null")
        }
        else{
          setOvertimeFeeError("")
        }     
      }
      if(name==="price"){
        if(!regexValueInput(value)){
          setPriceError("Must be number")
        }
        if(value===""){
          setPriceError("Not null")
        }
        else{
          setPriceError("")
        }     
      }
      if(name==="overtimeLimit"){
        if(!regexValueInput(value)){
          setOvertimeLimitError("Must be number")
        } if(value===""){
          setOvertimeLimitError("Not null")
        }
        else{
          setOvertimeLimitError("")
        }     
      }
      if(name==="freeshipDistance"){
        if(!regexValueInput(value)){
          setFreeshipError("Must be number")
        }if(value===""){
          setFreeshipError("Not null")
        }
        else{
          setFreeshipError("")
        }     
      }
      if(name==="deliveryFeePerKilometer"){
        if(!regexValueInput(value)){
          setDeliveryFeeError("Must be number")
        }if(value===""){
          setDeliveryFeeError("Not null")
        }
        else{
          setDeliveryFeeError("")
        }     
      }
      setFormData({
        ...formData,
        [name]: value,
      })
    
  };
  const handleAddressChange=(e)=>{
        setAddressDetail(e.target.value);
  }
  const handleReturnClick = () => {
    navigate("/registermotorbike", { state: { receiveData} });
  };
  const handleSubmitClick=()=>{
    if(deliveryFeeError||overtimeFeeError||overtimeLimitError||freeshipError){
      setError("Please enter correct  before submitting.");
    }
    const province = provinces.find(d => d.province_id === selectedProvince).province_name;
    const district = districts.find(d => d.district_id === selectedDistrict).district_name;
    const ward = wards.find(d => d.ward_id === selectedWard).ward_name;
    const address=addressDetail+","+ward+","+district+","+province
    setFormData({
      ...formData,
      motorbikeAddress:address
    })
    console.log(formData)
    axios
      .post("http://localhost:8080/api/motorbike/register", formData, {
        headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    .then((response) => {
      console.log("Data sent successfully:", response.data);
      navigate("/homepage")
      setLoading(false);
    })
    .catch((error) => {
      console.log(formData);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response);
        console.error("Status code:", error.response.status);
        console.error("Data:", error.response.data);

        if (error.response.status === 404) {
          setError(
            "Error 404: Not Found. The requested resource could not be found."
          );
        } else if (error.response.status === 409) {
          setError(error.response.data);
        } else {
          setError(
            `Error ${error.response.status}: ${
              error.response.data.message || "An error occurred."
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setError(
          "No response received. Please check your network connection."
        );
      }
      setLoading(false);
    });
};


  return (
    <div className="min-h-screen bg-zinc-50 p-6 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-screen-lg">
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Default price
          </label>
          <p className="text-sm text-zinc-500 mb-6">
            Unit price applies to all days. You can customize other prices for
            special days (weekends, holidays, Tet...) in the vehicle management
            section after registration.
          </p>
          <input
            type="text"
            name="price"
            className={`${inputClasses} mb-3`}
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
          />
          {priceError && <div className="text-red-500">{priceError}</div>}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-700 mb-2">
            Vehicle address
          </label>
          <div className="flex items-center mb-3">
            <input
              type="radio"
              name="address"
              id="defaultAddress"
              defaultChecked
              className="mr-2 focus:ring-green-500"
              onClick={handleCheckLocation}
            />
            
            <label htmlFor="defaultAddress" className="text-sm text-zinc-700">
              Your default address
            </label>
          </div>
          <div className="pl-6 mb-4 text-sm text-zinc-700">
            Royal City, Nguyễn Trãi, Thanh Xuân, Hà Nội
          </div>
          <div className="flex items-center mb-3"  >
            <input
              type="radio"
              name="address"
              id="newAddress"
              className="mr-2 focus:ring-green-500"
              onClick={handleCheckLocation}
            />
            <label htmlFor="newAddress" className="text-sm text-zinc-700">
              New Address
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"  >
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              id="provinces"
              name="province"
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={checkLocation}
            >
              <option value="">Select provinces</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedDistrict}
              name="district"
              onChange={handleDistrictChange}
              disabled={!selectedProvince}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedWard}
              name="ward"
              onChange={handleWardChange}
              disabled={!selectedDistrict}
              id="wards"
            >
              <option value="">Select wards</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </option>
              ))}
            </select>

            <input
              placeholder="Enter address detail"
              name="addressDetail"
              value={addressDetail}
              onChange={handleAddressChange}
              disabled={checkLocation}
              type="text"
                className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap mb-6">
          {/* Overtime fee section */}
          <div className="w-full sm:w-1/2 pr-3 mb-6 sm:mb-0">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Overtime fee
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="overtimeFee"
                className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter fee"
                value={formData.overtimeFee}
                onChange={handleChange}
              />
              
              <span className="text-sm text-zinc-700">VND/hour</span>
            </div>
            {overtimeFeeError && <div className="text-red-500">{overtimeFeeError}</div>}
          </div>

          {/* Overtime limit section */}
          <div className="w-full sm:w-1/2 pl-3">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Overtime limit
            </label>
            <div className="flex items-center">
              <input
                type="text"
                name="overtimeLimit"
                className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter limit"
                value={formData.overtimeLimit}
                onChange={handleChange}
              />             
              <span className="text-sm text-zinc-700">hour</span>
            </div>
            {overtimeLimitError && <div className="text-red-500">{overtimeLimitError}</div>}
          </div>
        </div>
       
        <div className="flex flex-wrap mb-6">
          <div className="w-full sm:w-1/2 pr-3 mb-6 sm:mb-0">
         <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Car delivery to your location</h2>
         <label className="relative inline-flex items-center cursor-pointer">
           <input type="checkbox" value={checkDelivery} className="sr-only peer" onClick={handleCheckDelivery} />
          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-green-600"></div>
         </label>
      </div>
      </div>
        <div className="flex flex-wrap justify-between mb-6 space-y-4"  >
          <div className="w-full md:w-1/2 pr-2" >
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Free Ship Distance
            </label>
            <div className="flex items-center" >
              <input
                type="text"
                name="freeshipDistance"
                className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter fee" 
                value={formData.freeshipDistance}
                disabled={checkDelivery}
                onChange={handleChange}
              />
              
              <span className="text-sm text-zinc-700">km</span>
            </div>
            {freeshipError && <div className="text-red-500">{freeshipError}</div>}
          </div>
          

          <div className="w-full md:w-1/2 pr-2" >
            <label className="block text-sm font-medium text-zinc-700 mb-1" >
              Delivery Fee
            </label>
            <div className="flex items-center" >
              <input type="text"
              name="deliveryFeePerKilometer"
            className="w-2/3 p-2 border rounded mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter fee"
                value={formData.deliveryFeePerKilometer} 
                disabled={checkDelivery}
                onChange={handleChange}
              />
              <span className="text-sm text-zinc-700">VND/km</span>
            </div>
            {deliveryFeeError && <div className="text-red-500">{deliveryFeeError}</div>}
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Image
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">
            Post multiple pictures from different angles to increase information
            about your vehicle.
          </p>
          <div className="mt-4">
            <div className="w-full h-64 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
              <button className="bg-teal-500 text-white py-2 px-4 rounded-lg">
                Choose image
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={handleReturnClick} className={buttonClasses}>
            Back
          </button>
          <button onClick={handleSubmitClick} className={buttonClasses}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterMotorbikeStep2;