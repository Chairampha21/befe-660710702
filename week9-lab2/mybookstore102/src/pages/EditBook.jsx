const validateForm = () => {
  const newErrors = {};

  // Title validation
  if (!formData.title.trim()) {
    newErrors.title = 'กรุณากรอกชื่อหนังสือ';
  } else if (formData.title.length < 2) {
    newErrors.title = 'ชื่อหนังสือต้องมีอย่างน้อย 2 ตัวอักษร';
  }

  // ISBN validation  
  if (!/^[0-9-]+$/.test(formData.isbn)) {
    newErrors.isbn = 'ISBN ต้องเป็นตัวเลขและเครื่องหมาย - เท่านั้น';
  }

  // Year validation
  const yearNum = parseInt(formData.year);
  const currentYear = new Date().getFullYear();
  if (yearNum < 1000 || yearNum > currentYear + 1) {
    newErrors.year = `ปีต้องอยู่ระหว่าง 1000 ถึง ${currentYear + 1}`;
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};