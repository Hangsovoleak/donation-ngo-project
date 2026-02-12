import { listBeneficiaries } from "../services/beneficiary.service.js";

// GET /api/beneficiaries
export async function listBeneficiariesController(req, res, next) {
  try {
    //create beneficiaries using await to pause the execution of an async function util a Promise is fulfilled as listBe..
    const beneficiaries = await listBeneficiaries();
    //return beneficiaries
    res.json(beneficiaries);
  } catch (err) {
    next(err);
  }
}
