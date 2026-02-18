import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
 * 🔹 CREATE APARTMENT
 */
  addApartment(payload: {
    name: string;
    address: string;
    address_lg: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/apartments`,
      payload
    );
  }

  /**
   * GET APARMENTS
   */
  getApartment(): Observable<any> {
    return this.http.get(`${this.baseUrl}/apartments/`);
  }

  /**
 * GET FLAT
 */
  getFlatsByFlatAdminId(): Observable<any> {
    return this.http.get(`${this.baseUrl}/flats/`);
  }
  /**
   * GET APARTMENT BY ID
   */
  getApartmentById(id: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/apartments/${id}`
    );
  }


  /**
   * UPDATE APARTMENT BY ID
   */
  updateApartmentById(
    id: string,
    payload: {
      name?: string;
      address?: string;
      address_lg?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/apartments/${id}`,
      payload
    );
  }

  /**
   * DELETE APARTMENT (SOFT DELETE)
   */
  deleteApartmentById(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/apartments/${id}`
    );
  }

  /**
 * 🔹 CREATE FLAT
 */
  addFlat(payload: {
    //apartmentId, flatNumber, floor, rentAmount
    apartmentId: string;
    flatNumber: string;
    floor: string;
    rentAmount: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/flats`,
      payload
    );
  }

  /**
   * GET FLAT BY ID
   */
  getFlatByApartmentId(apartmentId: string): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/flats/${apartmentId}`
    );
  }

  /**
   * UPDATE FLAT BY ID
   */
  updateFlatById(
    id: string,
    payload: {
      flatNumber?: string;
      floor?: string;
      rentAmount?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/flats/${id}`,
      payload
    );
  }

  /**
   * DELETE FLAT (SOFT DELETE)
   */
  deleteFlatById(id: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/flats/${id}`
    );
  }

  /**
 * ADD FLAT ADMIN
 */
  addFlatAdmin(payload: {
    name: string;
    mobile: string;
    password?: string;   // optional if user already exists
    apartmentId: string;
    flatId: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/flats/add_flat_admin`,
      payload
    );
  }

  /**
* ADD FLAT MEMBER  name, mobile, password, apartmentId, flatId, email
*/
  addMember(payload: {
    name: string;
    mobile: string;
    password?: string;
    apartmentId: string;
    flatId: string;
    email: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/flat-members/add`,
      payload
    );
  }


  /**
   * DELETE FLAT MEMBER (SOFT DELETE)
   */
  deleteFlatMemberById(userId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/flat-members/remove/${userId}`
    );
  }

  /**
   * UPDATE updateFlatAdminByFlatId
   */
  updateFlatAdminByFlatId(
    flatId: string,
    payload: {
      name?: string;
      mobile?: string;
      email?: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/flats/${flatId}/update-flat-admin`,
      payload
    );
  }


  // 1️⃣ Add Inventory (Apartment / Flat)
  addInventory(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory/`, payload);
  }

  // 2️⃣ Get Inventory by Apartment
  getInventoryByApartment(apartmentId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventory/apartment/${apartmentId}`);
  }

  // 3️⃣ Get Inventory by Flat
  getInventoryByFlat(flatId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventory/flat/${flatId}`);
  }

  // 4️⃣ Update Inventory Details
  updateInventory(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/inventory/${id}`, payload);
  }


  /**
   * 🔹 RAISE COMPLAINT (resident / flat_admin)
   */
  raiseComplaint(payload: {
    category: string;
    description: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/complaints`,
      payload
    );
  }

  /**
   * 🔹 GET FLAT COMPLAINTS (flat_admin)
   */
  getFlatComplaints(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/complaints/flat`
    );
  }

  /**
   * 🔹 GET MY COMPLAINTS (resident)
   */
  getMyComplaints(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/complaints/my`
    );
  }

  /**
   * 🔹 UPDATE COMPLAINT STATUS (apartment_admin)
   */
  updateComplaintStatus(
    id: string,
    payload: {
      status: string;
    }
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/complaints/status/${id}`,
      payload
    );
  }

  /**
   * 🔹 BROADCAST TO APARTMENT (apartment_admin)
   */
  broadcastToApartment(payload: {
    title: string;
    body: string;
  }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/complaints/broadcast`,
      payload
    );
  }

  /**
   * 🔹 GET ALL APARTMENT COMPLAINTS (apartment_admin)
   */
  getAllApartmentComplaints(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/complaints/apartment`
    );
  }

  /**
   * 🔹 GET ALL APARTMENT BROADCAST (apartment_members)
   */
  getApartmentBroadcast(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/complaints/apartment-broadcast`
    );
  }


}
