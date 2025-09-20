import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  HelpCircle,
  FileText,
} from "lucide-react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card, { CardBody } from "../components/UI/Card";

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", data);
      reset();
      alert("Pesan berhasil dikirim!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: ["support@weddingcommerce.com", "info@weddingcommerce.com"],
      description: "Kirim email kapan saja",
    },
    {
      icon: Phone,
      title: "Telepon",
      details: ["+62 812 3456 7890", "+62 21 1234 5678"],
      description: "Senin - Jumat, 08:00 - 17:00 WIB",
    },
    {
      icon: MapPin,
      title: "Alamat",
      details: ["Jl. Sudirman No. 123", "Jakarta Selatan 12190", "Indonesia"],
      description: "Kunjungi kantor kami",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      details: ["Senin - Jumat: 08:00 - 17:00", "Sabtu: 08:00 - 12:00"],
      description: "Customer support 24/7 online",
    },
  ];

  const faqs = [
    {
      question: "Bagaimana cara mendaftar sebagai vendor?",
      answer:
        'Anda dapat mendaftar sebagai vendor dengan mengklik tombol "Daftar sebagai Vendor" di halaman utama, kemudian mengisi formulir pendaftaran dan melengkapi profil bisnis Anda.',
    },
    {
      question: "Apakah ada biaya pendaftaran untuk customer?",
      answer:
        "Tidak ada biaya pendaftaran untuk customer. Anda dapat mendaftar dan menggunakan platform secara gratis.",
    },
    {
      question: "Bagaimana sistem pembayaran bekerja?",
      answer:
        "Kami menggunakan sistem escrow yang aman. Pembayaran akan ditahan hingga pesanan selesai, kemudian dana akan diteruskan ke vendor setelah konfirmasi dari customer.",
    },
    {
      question: "Bagaimana cara menghubungi customer support?",
      answer:
        "Anda dapat menghubungi customer support melalui email, telepon, atau chat online yang tersedia 24/7 di platform kami.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Hubungi <span className="text-gradient">Kami</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Ada pertanyaan atau butuh bantuan? Tim customer support kami siap
              membantu Anda 24/7
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                    <Send className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Kirim Pesan
                    </h2>
                    <p className="text-gray-600">
                      Kami akan merespons dalam 24 jam
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nama Lengkap"
                      placeholder="Masukkan nama lengkap"
                      error={errors.name?.message}
                      {...register("name", {
                        required: "Nama wajib diisi",
                        minLength: {
                          value: 3,
                          message: "Nama minimal 3 karakter",
                        },
                      })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="nama@email.com"
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email wajib diisi",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Format email tidak valid",
                        },
                      })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nomor Telepon"
                      placeholder="08xxxxxxxxxx"
                      error={errors.phone?.message}
                      {...register("phone", {
                        pattern: {
                          value: /^08\d{8,11}$/,
                          message: "Format nomor telepon tidak valid",
                        },
                      })}
                    />
                    <div>
                      <label className="label">Subjek</label>
                      <select
                        className="input"
                        {...register("subject", {
                          required: "Subjek wajib dipilih",
                        })}
                      >
                        <option value="">Pilih subjek</option>
                        <option value="general">Pertanyaan Umum</option>
                        <option value="technical">Bantuan Teknis</option>
                        <option value="billing">Pertanyaan Billing</option>
                        <option value="vendor">Pendaftaran Vendor</option>
                        <option value="complaint">Keluhan</option>
                        <option value="other">Lainnya</option>
                      </select>
                      {errors.subject && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">Pesan</label>
                    <textarea
                      className="input min-h-[120px] resize-none"
                      placeholder="Tuliskan pesan Anda di sini..."
                      {...register("message", {
                        required: "Pesan wajib diisi",
                        minLength: {
                          value: 10,
                          message: "Pesan minimal 10 karakter",
                        },
                      })}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Informasi Kontak
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {info.title}
                        </h4>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {detail}
                          </p>
                        ))}
                        <p className="text-xs text-gray-500 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Aksi Cepat
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat Online
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQ
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Panduan Penggunaan
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* FAQ */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pertanyaan Umum
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 mb-1">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lokasi Kantor Kami
            </h2>
            <p className="text-gray-600">
              Kunjungi kantor kami di Jakarta Selatan
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Peta akan ditampilkan di sini</p>
              <p className="text-sm text-gray-500">
                Jl. Sudirman No. 123, Jakarta Selatan
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
