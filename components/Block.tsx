/**
 * A polymorphic wrapper — it exists so sections can emit the right
 * element (<li> inside a list, <figure> in a collage) without every
 * caller repeating the layout props.
 *
 * It used to fade and rise its children on scroll. That came out after
 * measuring the reference: across 45 text nodes on maisonauge.com,
 * sampled from 300px below the fold through to leaving the viewport,
 * NOT ONE changed opacity, transform or clip-path. Their text is
 * completely static and all the motion lives on the imagery. Adding a
 * reveal here made the page read as a different site, so it is gone —
 * see ScrollMotion for the motion that is actually theirs.
 */
export default function Block({
  children,
  className = '',
  style,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}) {
  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}
