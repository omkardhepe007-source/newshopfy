/**
 * Profile.js - Customer profile view and update page.
 * Shows current profile details; toggle edit mode to update name, mobile, address.
 */
import React, { useEffect, useState } from "react";
import { userService } from "../../services";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  useAuth();

  useEffect(() => {
    userService
      .getProfile()
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        setForm({
          fullName: data.fullName,
          mobileNumber: data.mobileNumber || "",
          address: data.address || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile(form);
      setProfile(res.data.data);
      setEditing(false);
      setMsg("success");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-5 mt-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              {/* Avatar */}
              <div className="text-center mb-4">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold fs-2 mb-3"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                  }}
                >
                  {profile?.fullName?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold mb-0">{profile?.fullName}</h4>
                <span
                  className="badge px-3 py-1 mt-1"
                  style={{
                    background:
                      profile?.role === "ROLE_ADMIN" ? "#764ba2" : "#667eea",
                  }}
                >
                  {profile?.role === "ROLE_ADMIN"
                    ? "Administrator"
                    : "Customer"}
                </span>
              </div>

              {msg === "success" && (
                <div className="alert alert-success py-2 small">
                  <i className="bi bi-check-circle me-2"></i>Profile updated
                  successfully!
                </div>
              )}
              {msg === "error" && (
                <div className="alert alert-danger py-2 small">
                  <i className="bi bi-exclamation-circle me-2"></i>Update
                  failed. Try again.
                </div>
              )}

              {!editing ? (
                <>
                  <div className="row g-3 mb-4">
                    {[
                      {
                        icon: "bi-person",
                        label: "Full Name",
                        value: profile?.fullName,
                      },
                      {
                        icon: "bi-envelope",
                        label: "Email",
                        value: profile?.email,
                      },
                      {
                        icon: "bi-telephone",
                        label: "Mobile",
                        value: profile?.mobileNumber || "Not set",
                      },
                      {
                        icon: "bi-geo-alt",
                        label: "Address",
                        value: profile?.address || "Not set",
                      },
                      {
                        icon: "bi-calendar3",
                        label: "Member Since",
                        value: new Date(profile?.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "long", year: "numeric" },
                        ),
                      },
                    ].map((item, i) => (
                      <div key={i} className="col-12">
                        <div className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light">
                          <i
                            className={`bi ${item.icon} mt-1`}
                            style={{ color: "#667eea" }}
                          ></i>
                          <div>
                            <div className="text-muted small">{item.label}</div>
                            <div className="fw-semibold">{item.value}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn w-100 text-white fw-semibold py-2"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #764ba2)",
                      border: "none",
                    }}
                    onClick={() => setEditing(true)}
                  >
                    <i className="bi bi-pencil me-2"></i>Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={profile?.email}
                      disabled
                    />
                    <div className="form-text">Email cannot be changed.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.mobileNumber}
                      onChange={(e) =>
                        setForm({ ...form, mobileNumber: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">
                      Address
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Your shipping address"
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn flex-grow-1 text-white fw-semibold py-2"
                      style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        border: "none",
                      }}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
