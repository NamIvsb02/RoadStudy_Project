import illustration from "../../assets/images/journey-illustration.webp";

function AuthIllustration() {
  return <img src={illustration} alt="" width={1100} height={678} decoding="async" className="h-auto w-full object-contain" />;
}

export default function AuthShell({ welcome, subtitle, title, children }) {
  return (
    // Cột ảnh dính lại khi cuộn; cột form kéo dài theo nội dung (form đăng ký dài thì cuộn trang, ảnh vẫn đứng yên).
    // Đường kẻ dọc nằm ở cột form vì cột này luôn cao bằng cả hàng; form ngắn hơn ảnh thì căn giữa theo chiều dọc.
    <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
      <aside className="hidden lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-8 lg:self-start lg:py-6 lg:pr-12">
        <h2 className="text-headline font-bold text-primary-dark">{welcome}</h2>
        <AuthIllustration />
      </aside>
      <section className="mx-auto w-full max-w-md lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:border-l lg:border-line lg:py-6 lg:pl-12">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center">
            <h1 className="text-headline font-bold text-primary-dark uppercase">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted italic">{subtitle}</p>}
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
