<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
 *
 * @ApiResource(
 *      collectionOperations={"GET", "POST"},
 *      itemOperations={"GET", "PUT", "PATCH", "DELETE"},
 *      subresourceOperations={
 *          "api_maintenances_invoices_get_subresource"={
 *              "normalization_context"={"groups"={"invoices_subresource"}}
 *          }
 *      },
 *      attributes={
 *          "order": {"chrono":"ASC"}
 *      },
 *      normalizationContext={
 *          "groups"={"invoices_read"}
 *      },
 *      denormalizationContext={
 *          "disable_type_enforcement"=true
 *      }
 * )
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "maintenances_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @var MediaObject|null
     *
     * @ORM\ManyToOne(targetEntity=MediaObject::class)
     * @ORM\JoinColumn(nullable=true)
     */
    public $file;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Maintenance", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="La maintenance liée à la facture est obligatoire")
     */
    private $maintenance;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "maintenances_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le chrono de la facture est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre")
     */
    private $chrono;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMaintenance(): ?Maintenance
    {
        return $this->maintenance;
    }

    public function setMaintenance(?Maintenance $maintenance): self
    {
        $this->maintenance = $maintenance;

        return $this;
    }

    /**
     * @return Vehicule|null
     * @Groups({"invoices_read"})
     * @ApiSubresource()
     */
    public function getVehicule(): ?Vehicule
    {
        return $this->getMaintenance()->getVehicule();
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }

    /**
     * @return MediaObject|null
     */
    public function getFile(): ?MediaObject
    {
        return $this->file;
    }

    /**
     * @param MediaObject $file
     */
    public function setFile(MediaObject $file): void
    {
        $this->file = $file;
    }

    /**
     * @Groups({"maintenances_read"})
     * @return string|null
     */
    public function getFilePath()
    {
        if ($this->file)
            return $this->file->filePath;
        return null;
    }

}
